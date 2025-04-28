const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Conversation = require("../../models/Conversation");
const User = require("../../models/User");

// ✅ Start a Private or Group Conversation
router.post("/start", auth, async (req, res) => {
	try {
	  const { memberIds, groupName } = req.body;
  
	  const allMembers = [req.user.id, ...memberIds];
  
	  const isGroupChat = allMembers.length > 2; // if more than 2 members, it's a group
  
	  let conversation;
  
	  if (!isGroupChat) {
		// 🔵 For 1-to-1 chat, check if conversation already exists
		conversation = await Conversation.findOne({
		  isGroup: false,
		  members: { $all: allMembers, $size: 2 },
		});
	  }
  
	  if (!conversation) {
		// Create new conversation
		conversation = new Conversation({
		  isGroup: isGroupChat,
		  groupName: isGroupChat ? groupName : null,
		  members: allMembers,
		  groupAdmins: isGroupChat ? [req.user.id] : [],  // creator is admin
		});
  
		await conversation.save();
	  }
  
	  res.json(conversation);
	} catch (error) {
	  console.error(error.message);
	  res.status(500).send("Server Error");
	}
  });
// ✅ Get all my group conversations
router.get("/groups", auth, async (req, res) => {
	try {
		const groups = await Conversation.find({
			isGroup: true,
			members: { $in: [req.user.id] }
		}).populate("members", ["_id", "name", "avatar"]);

		res.json(groups);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Get a single conversation (needed for ChatWindow)
router.get("/:id", auth, async (req, res) => {
	try {
		const conversation = await Conversation.findById(req.params.id)
			.populate("members", ["_id", "name", "avatar"]);
		
		if (!conversation) {
			return res.status(404).json({ msg: "Conversation not found" });
		}

		res.json(conversation);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Make Admin in Group
router.put("/group/make-admin", auth, async (req, res) => {
	try {
		const { conversationId, userId } = req.body;

		await Conversation.findByIdAndUpdate(conversationId, {
			$addToSet: { groupAdmins: userId },
		});

		res.json({ msg: "User promoted to admin" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Remove Member from Group
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
