const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Conversation = require("../../models/Conversation");
const User = require("../../models/User");

// Start a Private or Group Conversation
router.post("/start", auth, async (req, res) => {
	try {
		const { memberIds, groupName } = req.body;

		const isGroup = memberIds.length > 1;

		const newConversation = new Conversation({
			isGroup,
			groupName: isGroup ? groupName : null,
			members: [req.user.id, ...memberIds],
			groupAdmins: isGroup ? [req.user.id] : [],
		});

		const conversation = await newConversation.save();
		res.json(conversation);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// Make Admin in Group
router.put("/group/make-admin", auth, async (req, res) => {
	try {
		const { conversationId, userId } = req.body;

		await Conversation.findByIdAndUpdate(conversationId, {
			$push: { groupAdmins: userId },
		});

		res.json({ msg: "User promoted to admin" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// Remove Member from Group
router.put("/group/remove-member", auth, async (req, res) => {
	try {
		const { conversationId, userId } = req.body;

		await Conversation.findByIdAndUpdate(conversationId, {
			$pull: { members: userId },
		});

		res.json({ msg: "User removed from group" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
