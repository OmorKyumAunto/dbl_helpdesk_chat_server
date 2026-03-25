const express = require("express");
const router = express.Router();
const chatController = require("./chat.controller");

// REST
router.post("/dm", chatController.createOrGetDM);                 // body: { toEmployeeId }
router.get("/conversations", chatController.getInbox);           // list inbox
router.get("/messages/:conversationId", chatController.getMessages); // query: limit, beforeId
router.delete("/conversations/:conversationId", chatController.deleteConversationForMe);
router.post("/conversations/:conversationId/mark-unread", chatController.markConversationUnread);
router.post("/conversations/:conversationId/mark-read", chatController.markConversationRead);
router.post("/conversations/:conversationId/archive", chatController.archiveConversationForMe);
router.post("/conversations/:conversationId/unarchive", chatController.unarchiveConversationForMe);

module.exports = router;