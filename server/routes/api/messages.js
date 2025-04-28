const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Message = require("../../models/Message");

// Send a Message
router.post("/send", auth, async (req, res) => {
	try {
		const { conversationId, text } = req.body;

		const newMessage = new Message({
			conversation: conversationId,
			sender: req.user.id,
			text,
		});

		const message = await newMessage.save();
		res.json(message);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// Fetch Messages in a Conversation
router.get("/:conversationId", auth, async (req, res) => {
	try {
		const messages = await Message.find({ conversation: req.params.conversationId }).populate('sender', ['name', 'avatar']);
		res.json(messages);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
