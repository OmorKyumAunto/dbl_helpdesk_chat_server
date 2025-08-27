// src/routes/push.js
const express = require('express');
const router = express.Router();
const { messaging } = require('../lib/firebase');
const db = require('../lib/db'); // your MySQL pool/connection
const rateLimit = require('express-rate-limit');

// Optional: prevent abuse on send endpoints
const sendLimiter = rateLimit({ windowMs: 60_000, max: 30 });

// 4.1 Register/refresh a token
router.post('/push/register', async (req, res) => {
  try {
    const { userId, token, platform, app = 'helpdesk', deviceId, deviceInfo } = req.body;

    if (!token || !platform) {
      return res.status(400).json({ error: 'token and platform are required' });
    }

    // Upsert logic
    await db.query(
      `
      INSERT INTO push_tokens (user_id, token, platform, app, device_id, device_info, last_seen_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        platform = VALUES(platform),
        app = VALUES(app),
        device_id = VALUES(device_id),
        device_info = VALUES(device_info),
        last_seen_at = NOW()
      `,
      [userId || null, token, platform, app, deviceId || null, deviceInfo ? JSON.stringify(deviceInfo) : null]
    );

    // (Optional) auto-subscribe each device to a per-user topic for easy fanout
    if (userId) {
      await messaging.subscribeToTopic([token], `user-${userId}`);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_register_token' });
  }
});

// 4.2 Unregister token (on logout / uninstall)
router.post('/push/unregister', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token required' });

    await db.query(`DELETE FROM push_tokens WHERE token = ?`, [token]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_unregister' });
  }
});

// 4.3 Subscribe/unsubscribe topics (for segments like "it-support" or "priority-high")
router.post('/push/subscribe', async (req, res) => {
  try {
    const { tokens = [], topic } = req.body;
    if (!topic || !Array.isArray(tokens) || tokens.length === 0)
      return res.status(400).json({ error: 'topic and tokens[] required' });

    const r = await messaging.subscribeToTopic(tokens, topic);
    res.json({ ok: true, result: r });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_subscribe' });
  }
});

router.post('/push/unsubscribe', async (req, res) => {
  try {
    const { tokens = [], topic } = req.body;
    if (!topic || tokens.length === 0)
      return res.status(400).json({ error: 'topic and tokens[] required' });

    const r = await messaging.unsubscribeFromTopic(tokens, topic);
    res.json({ ok: true, result: r });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_unsubscribe' });
  }
});

// 4.4 Send to specific users (server builds token list)
router.post('/push/send/users', sendLimiter, async (req, res) => {
  try {
    const { userIds = [], notification, data, url, image } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0)
      return res.status(400).json({ error: 'userIds[] required' });

    const [rows] = await db.query(
      `SELECT token FROM push_tokens WHERE user_id IN (?)`,
      [userIds]
    );
    const tokens = rows.map(r => r.token);

    const result = await sendMulticast(tokens, { notification, data, url, image });
    res.json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_send' });
  }
});

// 4.5 Send to a topic (e.g., all helpdesk agents)
router.post('/push/send/topic', sendLimiter, async (req, res) => {
  try {
    const { topic, notification, data, url, image } = req.body;
    if (!topic) return res.status(400).json({ error: 'topic required' });

    const message = buildMessage({ notification, data, url, image });
    const response = await messaging.send({ ...message, topic });
    res.json({ ok: true, messageId: response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_send_topic' });
  }
});

// 4.6 Quick test to a single token
router.post('/push/test', async (req, res) => {
  try {
    const { token, notification, data, url, image } = req.body;
    if (!token) return res.status(400).json({ error: 'token required' });

    const message = buildMessage({ notification, data, url, image, tokens: [token] });
    const response = await messaging.send({ ...message, token });
    res.json({ ok: true, messageId: response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_test_send' });
  }
});

// --- Helpers ---

// Build a cross-platform message
function buildMessage({ notification = {}, data = {}, url, image }) {
  // FCM data must be string:string
  const cleanData = {};
  if (data && typeof data === 'object') {
    for (const k of Object.keys(data)) cleanData[k] = String(data[k]);
  }

  const msg = {
    notification: {
      title: notification?.title || 'Notification',
      body: notification?.body || '',
      imageUrl: image || undefined,
    },
    data: cleanData,
    android: {
      priority: 'high',
      ttl: 60 * 60 * 1000, // 1 hour
      notification: {
        sound: 'default',
        channelId: 'default',
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      },
    },
    apns: {
      headers: { 'apns-priority': '10' }, // immediate
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
          // set to 1 for silent/background updates:
          // 'content-available': 1
        },
      },
    },
    webpush: {
      headers: { Urgency: 'high' },
      fcmOptions: url ? { link: url } : undefined,
      notification: {
        icon: '/icons/icon-192.png', // your PWA icon path (optional)
        image,                        // shows big image on supported browsers
      },
    },
  };

  // Remove empties (helps avoid Admin SDK complaints)
  if (!image) delete msg.notification.imageUrl;
  if (!url) delete msg.webpush.fcmOptions;
  return msg;
}

// FCM multicast limit is 500 tokens per call
async function sendMulticast(allTokens, payload) {
  const chunkSize = 500;
  let successCount = 0;
  let failureCount = 0;
  const invalidTokens = [];

  for (let i = 0; i < allTokens.length; i += chunkSize) {
    const tokens = allTokens.slice(i, i + chunkSize);
    const message = buildMessage(payload);
    const response = await messaging.sendEachForMulticast({ tokens, ...message });

    successCount += response.successCount;
    failureCount += response.failureCount;

    response.responses.forEach((r, idx) => {
      if (!r.success) {
        const code = r.error?.code || '';
        if (code.includes('registration-token-not-registered') || code.includes('invalid-registration-token')) {
          invalidTokens.push(tokens[idx]);
        }
      }
    });
  }

  // Clean up invalid tokens
  if (invalidTokens.length) {
    await db.query(`DELETE FROM push_tokens WHERE token IN (?)`, [invalidTokens]);
  }

  return { successCount, failureCount, invalidTokens };
}

module.exports = router;
