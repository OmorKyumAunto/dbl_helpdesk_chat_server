const jwt = require("jsonwebtoken");
const { connectionDblystem } = require("../connections/connection");

const onlineUsers = new Map();

const lastSeenMap = new Map();

function getEmployeeIdFromSocket(socket) {
  const token = socket.handshake.auth?.token;
  if (!token) throw new Error("No token");

  const decoded = jwt.verify(token, global.config.secretKey, {
    algorithms: [global.config.algorithm || "HS256"],
  });

  if (!decoded.employee_id) throw new Error("No employee_id in token");
  return String(decoded.employee_id);
}

function setOnline(employeeId, socketId) {
  if (!onlineUsers.has(employeeId)) onlineUsers.set(employeeId, new Set());
  onlineUsers.get(employeeId).add(socketId);
}

function setOffline(employeeId, socketId) {
  const set = onlineUsers.get(employeeId);
  if (!set) return false;
  set.delete(socketId);
  if (set.size === 0) {
    onlineUsers.delete(employeeId);
    return true;
  }
  return false;
}

function isOnline(employeeId) {
  return onlineUsers.has(String(employeeId));
}

function emitPresenceUpdate(io, employeeId, online) {
  const emp = String(employeeId);

  if (online) {
    io.emit("presence:update", {
      employee_id: emp,
      online: true,
      last_seen_at: null,
      online_since: new Date().toISOString(),
    });
  } else {
    const last = lastSeenMap.get(emp) || new Date();
    io.emit("presence:update", {
      employee_id: emp,
      online: false,
      last_seen_at: last.toISOString(),
      online_since: null,
    });
  }
}

function initChatSocket(io) {
  io.use((socket, next) => {
    try {
      socket.employeeId = getEmployeeIdFromSocket(socket);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const employeeId = String(socket.employeeId);

    socket.join(`user:${employeeId}`);

    const wasOffline = !isOnline(employeeId);
    setOnline(employeeId, socket.id);

    if (wasOffline) emitPresenceUpdate(io, employeeId, true);

    // ✅ When user comes online: mark ALL pending receipts as delivered
    connectionDblystem.query(
      `
        SELECT r.message_id, m.sender_employee_id
        FROM message_receipts r
        JOIN messages m ON m.id = r.message_id
        WHERE r.employee_id = ?
          AND r.delivered_at IS NULL
      `,
      [employeeId],
      (err, rows) => {
        if (err || !rows?.length) return;

        connectionDblystem.query(
          `UPDATE message_receipts
           SET delivered_at = NOW()
           WHERE employee_id=? AND delivered_at IS NULL`,
          [employeeId],
          () => { },
        );

        // notify senders -> sender sees ✓✓
        rows.forEach((x) => {
          io.to(`user:${String(x.sender_employee_id)}`).emit("chat:receipt", {
            type: "delivered",
            message_id: x.message_id,
            to_employee_id: employeeId,
            delivered_at: new Date().toISOString(),
          });
        });
      },
    );

    socket.on("presence:subscribe", ({ employeeIds }) => {
      if (!Array.isArray(employeeIds)) return;
      const unique = Array.from(new Set(employeeIds.map((x) => String(x))));

      const status = unique.map((id) => ({
        employee_id: id,
        online: isOnline(id),
        last_seen_at: isOnline(id)
          ? null
          : lastSeenMap.get(id)?.toISOString() || null,
      }));

      socket.emit("presence:status", status);
    });

    socket.on("chat:typing", ({ conversationId }) => {
      if (!conversationId) return;

      connectionDblystem.query(
        "SELECT employee_id FROM conversation_members WHERE conversation_id=?",
        [conversationId],
        (err, members) => {
          if (err) return;

          members
            .map((m) => String(m.employee_id))
            .filter((id) => id !== employeeId)
            .forEach((id) => {
              io.to(`user:${id}`).emit("chat:typing", {
                conversation_id: Number(conversationId),
                from_employee_id: employeeId,
              });
            });
        },
      );
    });

    socket.on("chat:stopTyping", ({ conversationId }) => {
      if (!conversationId) return;

      connectionDblystem.query(
        "SELECT employee_id FROM conversation_members WHERE conversation_id=?",
        [conversationId],
        (err, members) => {
          if (err) return;

          members
            .map((m) => String(m.employee_id))
            .filter((id) => id !== employeeId)
            .forEach((id) => {
              io.to(`user:${id}`).emit("chat:stopTyping", {
                conversation_id: Number(conversationId),
                from_employee_id: employeeId,
              });
            });
        },
      );
    });

    socket.on("chat:send", ({ conversationId, text }) => {
      if (!conversationId || !text || !text.trim()) return;

      connectionDblystem.query(
        "SELECT 1 FROM conversation_members WHERE conversation_id=? AND employee_id=? LIMIT 1",
        [conversationId, employeeId],
        (err, ok) => {
          if (err) return socket.emit("chat:error", { message: "DB error" });
          if (!ok.length)
            return socket.emit("chat:error", { message: "Forbidden" });

          connectionDblystem.query(
            "INSERT INTO messages (conversation_id, sender_employee_id, message) VALUES (?, ?, ?)",
            [conversationId, employeeId, text.trim()],
            (err2, result) => {
              if (err2)
                return socket.emit("chat:error", {
                  message: "DB error saving message",
                });

              const msgId = result.insertId;
              connectionDblystem.query(
                "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                [conversationId],
                () => { },
              );

              // get members
              connectionDblystem.query(
                "SELECT employee_id FROM conversation_members WHERE conversation_id=?",
                [conversationId],
                (err3, members) => {
                  if (err3) return;

                  const memberIds = members.map((m) => String(m.employee_id));
                  const recipientIds = memberIds.filter(
                    (id) => id !== employeeId,
                  );
                  // ✅ If recipient had deleted (or archived) this chat, revive it when new message arrives
                  if (recipientIds.length) {
                    const placeholders = recipientIds.map(() => "?").join(",");

                    connectionDblystem.query(
                      `DELETE FROM conversation_deleted
     WHERE conversation_id = ?
       AND employee_id IN (${placeholders})`,
                      [conversationId, ...recipientIds],
                      () => { },
                    );

                    
                  }

                  if (recipientIds.length) {
                    const values = recipientIds.map(() => "(?, ?)").join(",");
                    const params = [];
                    recipientIds.forEach((rid) => params.push(msgId, rid));

                    connectionDblystem.query(
                      `INSERT IGNORE INTO message_receipts (message_id, employee_id) VALUES ${values}`,
                      params,
                      () => { },
                    );
                  }

                  connectionDblystem.query(
                    `SELECT m.id, m.conversation_id, m.sender_employee_id,
                            u.name AS sender_name, m.message, m.created_at
                     FROM messages m
                     LEFT JOIN dbl_users u ON u.employee_id = m.sender_employee_id
                     WHERE m.id=?`,
                    [msgId],
                    (err4, rows) => {
                      if (err4 || !rows.length) return;

                      const msg = rows[0];

                      memberIds.forEach((id) =>
                        io.to(`user:${id}`).emit("chat:message", msg),
                      );

                      recipientIds.forEach((rid) => {
                        if (!isOnline(rid)) return;

                        connectionDblystem.query(
                          `UPDATE message_receipts
                           SET delivered_at = NOW()
                           WHERE message_id=? AND employee_id=? AND delivered_at IS NULL`,
                          [msgId, rid],
                          () => {
                            io.to(`user:${employeeId}`).emit("chat:receipt", {
                              type: "delivered",
                              message_id: msgId,
                              to_employee_id: rid,
                              delivered_at: new Date().toISOString(),
                            });
                          },
                        );
                      });
                    },
                  );
                },
              );
            },
          );
        },
      );
    });

    // -------- Read receipts --------
    socket.on("chat:read", ({ conversationId, lastReadMessageId }) => {
      if (!conversationId || !lastReadMessageId) return;

      connectionDblystem.query(
        "SELECT 1 FROM conversation_members WHERE conversation_id=? AND employee_id=? LIMIT 1",
        [conversationId, employeeId],
        (err, ok) => {
          if (err || !ok.length) return;

          connectionDblystem.query(
            `INSERT INTO conversation_reads (conversation_id, employee_id, last_read_message_id)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE last_read_message_id = GREATEST(last_read_message_id, VALUES(last_read_message_id))`,
            [conversationId, employeeId, lastReadMessageId],
            () => { },
          );

          connectionDblystem.query(
            `UPDATE message_receipts r
             JOIN messages m ON m.id = r.message_id
             SET r.read_at = NOW()
             WHERE m.conversation_id=?
               AND r.employee_id=?
               AND m.id <= ?
               AND r.read_at IS NULL`,
            [conversationId, employeeId, lastReadMessageId],
            () => { },
          );

          // notify other members
          connectionDblystem.query(
            "SELECT employee_id FROM conversation_members WHERE conversation_id=?",
            [conversationId],
            (err2, members) => {
              if (err2) return;

              members
                .map((m) => String(m.employee_id))
                .filter((id) => id !== employeeId)
                .forEach((id) => {
                  io.to(`user:${id}`).emit("chat:receipt", {
                    type: "read",
                    conversation_id: Number(conversationId),
                    reader_employee_id: employeeId,
                    last_read_message_id: Number(lastReadMessageId),
                    read_at: new Date().toISOString(),
                  });
                });
            },
          );
        },
      );
    });

    socket.on("disconnect", () => {
      const fullyOffline = setOffline(employeeId, socket.id);

      if (fullyOffline) {
        lastSeenMap.set(employeeId, new Date());
        emitPresenceUpdate(io, employeeId, false);
      }
    });
  });
}

module.exports = { initChatSocket, onlineUsers };
