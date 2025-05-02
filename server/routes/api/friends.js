const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const FriendRequest = require("../../models/FriendRequest");
const User = require("../../models/User");

// 📩 Send Friend Request
router.post("/request", auth, async (req, res) => {
	try {
		const { receiverId } = req.body;

		const existingRequest = await FriendRequest.findOne({
			sender: req.user.id,
			receiver: receiverId,
		});

		if (existingRequest) {
			return res.status(400).json({ msg: "Friend request already sent" });
		}

		const newRequest = new FriendRequest({
			sender: req.user.id,
			receiver: receiverId,
		});

		await newRequest.save();
		res.json(newRequest);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Fetch Pending Friend Requests (for current user)
router.get("/requests", auth, async (req, res) => {
	try {
		const requests = await FriendRequest.find({ receiver: req.user.id })
			.populate("sender", ["name", "avatar"])
			.sort({ createdAt: -1 });

		res.json(requests);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Accept Friend Request
router.post("/accept", auth, async (req, res) => {
	try {
		const { requestId } = req.body;

		const request = await FriendRequest.findById(requestId);

		if (!request || request.receiver.toString() !== req.user.id) {
			return res.status(400).json({ msg: "Invalid request" });
		}

		const sender = await User.findById(request.sender);
		const receiver = await User.findById(request.receiver);

		// Add each other as friends
		sender.friends.push(receiver._id);
		receiver.friends.push(sender._id);

		await sender.save();
		await receiver.save();
		await request.remove();

		res.json({ msg: "Friend request accepted" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Decline Friend Request
router.post("/decline", auth, async (req, res) => {
	try {
		const { requestId } = req.body;

		const request = await FriendRequest.findById(requestId);

		if (!request || request.receiver.toString() !== req.user.id) {
			return res.status(400).json({ msg: "Invalid request" });
		}

		await request.remove();
		res.json({ msg: "Friend request declined" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Get Friend List
router.get("/list", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("friends", ["name", "avatar"]);
		res.json(user.friends);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// ✅ Get Friend Suggestions
router.get("/suggestions", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		const sentRequests = await FriendRequest.find({ sender: req.user.id }).select("receiver");
		const sentTo = sentRequests.map(r => r.receiver.toString());

		const receivedRequests = await FriendRequest.find({ receiver: req.user.id }).select("sender");
		const receivedFrom = receivedRequests.map(r => r.sender.toString());

		const blockedUsers = user.blockedUsers ? user.blockedUsers.map(id => id.toString()) : [];

		const excludeIds = [
			req.user.id,
			...user.friends.map(id => id.toString()),
			...sentTo,
			...receivedFrom,
			...blockedUsers
		];

		const suggestions = await User.find({
			_id: { $nin: excludeIds },
			blocked: { $ne: true }
		})
		.select("name avatar role program starting_year passing_year location organisation");

		res.json(suggestions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error in suggestions");
	}
});


 // ✅ Get friend requests that I have sent to others
router.get("/requests/sent", auth, async (req, res) => {
	try {
		const requests = await FriendRequest.find({
			sender: req.user.id,
			status: "pending"
		})
		.populate("receiver", ["name", "avatar", "role", "program", "starting_year"])
		.sort({ createdAt: -1 });

		res.json(requests);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error in fetching sent requests");
	}
});

router.post("/cancel", auth, async (req, res) => {
	try {
		const { requestId } = req.body;

		const request = await FriendRequest.findById(requestId);

		if (!request || request.sender.toString() !== req.user.id) {
			return res.status(400).json({ msg: "Invalid request or not authorized" });
		}

		await request.remove();
		res.json({ msg: "Friend request canceled" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error in canceling friend request");
	}
});


module.exports = router;
