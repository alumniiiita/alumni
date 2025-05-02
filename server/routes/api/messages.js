const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const User = require("../../models/User");
const mongoose = require("mongoose");  // ✅ Important

// ✅ Send a message
router.post("/send", auth, async (req, res) => {
	const { conversationId, text } = req.body;
  
	try {
	  const conversation = await Conversation.findById(conversationId).populate("members");
  
	  const receiver = conversation.members.find(
		(m) => m._id.toString() !== req.user.id
	  );
  
	  if (receiver) {
		const receiverUser = await User.findById(receiver._id);
		if (receiverUser.blockedUsers.includes(req.user.id)) {
		  return res.status(403).json({ msg: "You are blocked by this user." });
		}
	  }
  
	  const newMessage = new Message({
		conversationId,
		sender: req.user.id,
		text,
	  });
  
	  await newMessage.save();
	  res.json(newMessage);
	} catch (err) {
	  console.error(err.message);
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
