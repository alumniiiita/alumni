const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Message = require("../../models/Message");
const mongoose = require("mongoose");  // ✅ Important

// ✅ Send a message
router.post("/send", auth, async (req, res) => {
	try {
		const { conversationId, text } = req.body;
		//console.log(req.body)
		const message = new Message({
			conversation: mongoose.Types.ObjectId(conversationId),  // ✅ force correct type
			sender: mongoose.Types.ObjectId(req.user.id),             // ✅ force correct type
			text,
		});
		//console.log("messag saved")
		await message.save();
		res.json(message);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Get all messages of a conversation
router.get("/:conversationId", auth, async (req, res) => {
	try {
		//console.log("convid1",req.params.conversationId)
		const conversationId = mongoose.Types.ObjectId(req.params.conversationId);  // ✅ important
		const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });  // ✅ sorted by time
		// console.log("convid",conversationId)
		// console.log("messages",messages)
		res.json(messages);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
