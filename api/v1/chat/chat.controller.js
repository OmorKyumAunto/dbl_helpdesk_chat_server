const jwt = require("jsonwebtoken");
const { connectionDblystem } = require("../connections/connection");

function getToken(req) {
  const h = (req.headers.authorization || "").trim();
  if (!h) return null;
  // support both "Bearer xxx" and "xxx"
  if (h.toLowerCase().startsWith("bearer ")) return h.slice(7).trim();
  return h;
}

function getEmployeeIdFromReq(req) {
  // Prefer JWT (recommended)
  const token = getToken(req);
  if (token) {
    const decoded = jwt.verify(token, global.config.secretKey, {
      algorithms: [global.config.algorithm || "HS256"],
    });
    // Your token payload includes employee_id (confirmed)
    return decoded.employee_id;
  }

  // Fallback for testing only (remove later)
  return req.headers["x-employee-id"] || null;
}

function makeDmKey(empA, empB) {
  const a = String(empA);
  const b = String(empB);
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

// --- Controllers ---

// POST /api/v1/chat/dm
// body: { toEmployeeId: "15107556" }
exports.createOrGetDM = (req, res) => {
  const fromEmployeeId = getEmployeeIdFromReq(req);
  const { toEmployeeId } = req.body || {};

  if (!fromEmployeeId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!toEmployeeId) {
    return res
      .status(400)
      .json({ success: false, message: "toEmployeeId required" });
  }
  if (String(fromEmployeeId) === String(toEmployeeId)) {
    return res
      .status(400)
      .json({ success: false, message: "Cannot DM yourself" });
  }

  const dmKey = makeDmKey(fromEmployeeId, toEmployeeId);

  // 1) if conversation exists
  connectionDblystem.query(
    "SELECT id FROM conversations WHERE type='dm' AND dm_key = ? LIMIT 1",
    [dmKey],
    (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, message: "DB error" });

      if (rows.length) {
        const conversationId = rows[0].id;

        connectionDblystem.query(
          "DELETE FROM conversation_deleted WHERE conversation_id=? AND employee_id=?",
          [conversationId, fromEmployeeId],
          () => {
            return res.json({ success: true, conversationId });
          },
        );

        return;
      }

      // 2) create new conversation
      connectionDblystem.query(
        "INSERT INTO conversations (type, dm_key) VALUES ('dm', ?)",
        [dmKey],
        (err2, result) => {
          if (err2)
            return res
              .status(500)
              .json({ success: false, message: "DB error" });

          const conversationId = result.insertId;

          // 3) add members (2 rows)
          connectionDblystem.query(
            `INSERT INTO conversation_members (conversation_id, employee_id)
             VALUES (?, ?), (?, ?)`,
            [conversationId, fromEmployeeId, conversationId, toEmployeeId],
            (err3) => {
              if (err3)
                return res
                  .status(500)
                  .json({ success: false, message: "DB error" });

              return res.json({ success: true, conversationId });
            },
          );
        },
      );
    },
  );
};

// GET /api/v1/chat/conversations
exports.getInbox = (req, res) => {
  const employeeId = getEmployeeIdFromReq(req);
  if (!employeeId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const archivedOnly = req.query.archived === "1";

  const sql = `
    SELECT
      c.id AS conversation_id,
      c.updated_at,
      other.employee_id AS other_employee_id,
      u.name AS other_name,
      u.email AS other_email,

      lm.message AS last_message,
      lm.created_at AS last_message_at,

      ca.archived_at AS archived_at,

      COALESCE((
        SELECT COUNT(*)
        FROM messages m2
        LEFT JOIN conversation_reads cr
          ON cr.conversation_id = c.id AND cr.employee_id = ?
        WHERE m2.conversation_id = c.id
          AND m2.sender_employee_id <> ?
          AND m2.id > COALESCE(cr.last_read_message_id, 0)
      ), 0) AS unread_count

    FROM conversations c

    JOIN conversation_members me
      ON me.conversation_id = c.id AND me.employee_id = ?

    JOIN conversation_members other
      ON other.conversation_id = c.id AND other.employee_id <> ?

    LEFT JOIN dbl_users u
      ON u.employee_id = other.employee_id

    LEFT JOIN messages lm
      ON lm.id = (
        SELECT id FROM messages
        WHERE conversation_id=c.id
        ORDER BY id DESC LIMIT 1
      )

    LEFT JOIN conversation_deleted cd
      ON cd.conversation_id = c.id
      AND cd.employee_id = ?

    LEFT JOIN conversation_archived ca
      ON ca.conversation_id = c.id
      AND ca.employee_id = ?

    WHERE c.type = 'dm'
      AND cd.conversation_id IS NULL
      AND ${
        archivedOnly
          ? "ca.conversation_id IS NOT NULL"
          : "ca.conversation_id IS NULL"
      }

    ORDER BY COALESCE(last_message_at, c.updated_at) DESC, c.updated_at DESC
  `;

  connectionDblystem.query(
    sql,
    [
      employeeId, // cr
      employeeId, // sender != me
      employeeId, // me
      employeeId, // other
      employeeId, // cd
      employeeId, // ca
    ],
    (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, message: "DB error" });
      return res.json({ success: true, data: rows });
    }
  );
};

// GET /api/v1/chat/messages/:conversationId?limit=30&beforeId=123
exports.getMessages = (req, res) => {
  const employeeId = getEmployeeIdFromReq(req);
  const { conversationId } = req.params;
  const limit = Math.min(parseInt(req.query.limit || "30", 10), 100);
  const beforeId = req.query.beforeId ? parseInt(req.query.beforeId, 10) : null;

  if (!employeeId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  connectionDblystem.query(
    "SELECT 1 FROM conversation_members WHERE conversation_id=? AND employee_id=? LIMIT 1",
    [conversationId, employeeId],
    (err, ok) => {
      if (err)
        return res.status(500).json({ success: false, message: "DB error" });
      if (!ok.length)
        return res.status(403).json({ success: false, message: "Forbidden" });

      // find other member (DM)
      connectionDblystem.query(
        "SELECT employee_id FROM conversation_members WHERE conversation_id=? AND employee_id<>? LIMIT 1",
        [conversationId, employeeId],
        (err0, otherRows) => {
          if (err0)
            return res
              .status(500)
              .json({ success: false, message: "DB error" });
          const otherEmployeeId = otherRows?.[0]?.employee_id
            ? String(otherRows[0].employee_id)
            : null;

          const sql = `
            SELECT
              m.id,
              m.conversation_id,
              m.sender_employee_id,
              u.name AS sender_name,
              m.message,
              m.created_at,

              r.delivered_at,
              r.read_at
            FROM messages m
            LEFT JOIN dbl_users u
              ON u.employee_id = m.sender_employee_id
            LEFT JOIN message_receipts r
              ON r.message_id = m.id AND r.employee_id = ?
            WHERE m.conversation_id = ?
            ${beforeId ? "AND m.id < ?" : ""}
            ORDER BY m.id DESC
            LIMIT ?
          `;

          const params = beforeId
            ? [otherEmployeeId || "", conversationId, beforeId, limit]
            : [otherEmployeeId || "", conversationId, limit];

          connectionDblystem.query(sql, params, (err2, rows) => {
            if (err2)
              return res
                .status(500)
                .json({ success: false, message: "DB error" });
            rows.reverse(); // oldest->newest
            return res.json({ success: true, data: rows });
          });
        },
      );
    },
  );
};

// DELETE /api/v1/chat/conversations/:conversationId
exports.deleteConversationForMe = (req, res) => {
  const employeeId = getEmployeeIdFromReq(req);
  const { conversationId } = req.params;

  if (!employeeId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // must be member
  connectionDblystem.query(
    "SELECT 1 FROM conversation_members WHERE conversation_id=? AND employee_id=? LIMIT 1",
    [conversationId, employeeId],
    (err, ok) => {
      if (err)
        return res.status(500).json({ success: false, message: "DB error" });
      if (!ok.length)
        return res.status(403).json({ success: false, message: "Forbidden" });

      // soft delete for THIS user only
      connectionDblystem.query(
        `INSERT INTO conversation_deleted (conversation_id, employee_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE deleted_at = CURRENT_TIMESTAMP`,
        [conversationId, employeeId],
        (err2) => {
          if (err2)
            return res
              .status(500)
              .json({ success: false, message: "DB error" });
          return res.json({ success: true, message: "Deleted for you" });
        },
      );
    },
  );
};

// POST /api/v1/chat/conversations/:conversationId/mark-unread
exports.markConversationUnread = (req, res) => {
  const employeeId = getEmployeeIdFromReq(req);
  const { conversationId } = req.params;

  if (!employeeId) {
    return res.status(401).json({ success: false });
  }

  connectionDblystem.query(
    `INSERT INTO conversation_reads (conversation_id, employee_id, last_read_message_id)
     VALUES (?, ?, 0)
     ON DUPLICATE KEY UPDATE last_read_message_id = 0`,
    [conversationId, employeeId],
    (err) => {
      if (err) return res.status(500).json({ success: false });
      return res.json({ success: true });
    }
  );
};


// POST /api/v1/chat/conversations/:conversationId/mark-read
// body: { lastReadMessageId?: number } (optional; if not provided, uses latest message)
exports.markConversationRead = (req, res) => {
  const employeeId = getEmployeeIdFromReq(req);
  const { conversationId } = req.params;

  if (!employeeId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // must be member
  connectionDblystem.query(
    "SELECT 1 FROM conversation_members WHERE conversation_id=? AND employee_id=? LIMIT 1",
    [conversationId, employeeId],
    (err, ok) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
      if (!ok.length) return res.status(403).json({ success: false, message: "Forbidden" });

      const provided = req.body?.lastReadMessageId ? Number(req.body.lastReadMessageId) : null;

      const proceed = (lastReadMessageId) => {
        connectionDblystem.query(
          `INSERT INTO conversation_reads (conversation_id, employee_id, last_read_message_id)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE last_read_message_id =
             GREATEST(last_read_message_id, VALUES(last_read_message_id))`,
          [conversationId, employeeId, lastReadMessageId],
          (e2) => {
            if (e2) return res.status(500).json({ success: false, message: "DB error" });

            connectionDblystem.query(
              `UPDATE message_receipts r
               JOIN messages m ON m.id = r.message_id
               SET r.read_at = NOW()
               WHERE m.conversation_id=?
                 AND r.employee_id=?
                 AND m.id <= ?
                 AND r.read_at IS NULL`,
              [conversationId, employeeId, lastReadMessageId],
              (e3) => {
                if (e3) return res.status(500).json({ success: false, message: "DB error" });
                return res.json({ success: true, lastReadMessageId });
              }
            );
          }
        );
      };

      if (provided) return proceed(provided);

      // if not provided -> use latest message id
      connectionDblystem.query(
        "SELECT id FROM messages WHERE conversation_id=? ORDER BY id DESC LIMIT 1",
        [conversationId],
        (e1, rows) => {
          if (e1) return res.status(500).json({ success: false, message: "DB error" });
          const lastId = rows?.[0]?.id ? Number(rows[0].id) : 0;
          return proceed(lastId);
        }
      );
    }
  );
};


// POST /api/v1/chat/conversations/:conversationId/archive
exports.archiveConversationForMe = (req, res) => {
  const employeeId = getEmployeeIdFromReq(req);
  const { conversationId } = req.params;

  if (!employeeId) return res.status(401).json({ success: false, message: "Unauthorized" });

  connectionDblystem.query(
    "SELECT 1 FROM conversation_members WHERE conversation_id=? AND employee_id=? LIMIT 1",
    [conversationId, employeeId],
    (err, ok) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
      if (!ok.length) return res.status(403).json({ success: false, message: "Forbidden" });

      connectionDblystem.query(
        `INSERT INTO conversation_archived (conversation_id, employee_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE archived_at = CURRENT_TIMESTAMP`,
        [conversationId, employeeId],
        (err2) => {
          if (err2) return res.status(500).json({ success: false, message: "DB error" });
          return res.json({ success: true, message: "Archived" });
        }
      );
    }
  );
};

// POST /api/v1/chat/conversations/:conversationId/unarchive
exports.unarchiveConversationForMe = (req, res) => {
  const employeeId = getEmployeeIdFromReq(req);
  const { conversationId } = req.params;

  if (!employeeId) return res.status(401).json({ success: false, message: "Unauthorized" });

  connectionDblystem.query(
    `DELETE FROM conversation_archived
     WHERE conversation_id=? AND employee_id=?`,
    [conversationId, employeeId],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
      return res.json({ success: true, message: "Unarchived" });
    }
  );
};