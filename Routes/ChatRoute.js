const express = require('express');
const { createChat, findChat, userChats } = require('../Controller/ChatController');

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
