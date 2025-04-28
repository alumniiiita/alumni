const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const Story = require("../../models/Story");
const User = require("../../models/User");

// Multer Storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/stories");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({ storage });

// POST /api/stories - Create Story
router.post("/", auth, upload.single("image"), [
	check("text", "Story text is required").not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(req.user.id).select("-password");

		if (user.role !== "alumni") {
			return res.status(403).json({ msg: "Only Alumni can post stories" });
		}

		const newStory = new Story({
			user: req.user.id,
			name: user.name,
			text: req.body.text,
			image: req.file ? `/uploads/stories/${req.file.filename}` : null
		});

		const story = await newStory.save();
		res.json(story);

	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// GET /api/stories - Fetch Stories with Pagination
router.get("/", async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = 5;

	try {
		const stories = await Story.find()
			.sort({ date: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		res.json(stories);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// PUT /api/stories/like/:id - Like a story
router.put("/like/:id", auth, async (req, res) => {
	try {
		const story = await Story.findById(req.params.id);

		if (story.likes.some(like => like.user.toString() === req.user.id)) {
			return res.status(400).json({ msg: "Already liked" });
		}

		story.likes.unshift({ user: req.user.id });
		await story.save();
		res.json(story.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// PUT /api/stories/unlike/:id - Unlike a story
router.put("/unlike/:id", auth, async (req, res) => {
	try {
		const story = await Story.findById(req.params.id);

		if (!story.likes.some(like => like.user.toString() === req.user.id)) {
			return res.status(400).json({ msg: "Not yet liked" });
		}

		story.likes = story.likes.filter(({ user }) => user.toString() !== req.user.id);
		await story.save();
		res.json(story.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
