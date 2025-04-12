const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authHeadAdmin = require("../../middleware/authHeadAdmin");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Filter = require("bad-words");
const { check, validationResult } = require("express-validator");
var mongoose = require("mongoose");
const PostRequest = require("../../models/PostRequest");
const Setting = require("../../models/Setting");
const Channel = require("../../models/Channel");

// @route    POST api/posts
// @desc     create a post request
// @access   Private
router.post(
	"/create-post-request",
	[
		auth,
		[
			check("text", "Body Text is required").not().isEmpty(),
			check("heading", "Heading is required").not().isEmpty(),
			check(
				"visibleStudent",
				"Student visibility value Is required"
			).isBoolean(),
			check(
				"visibleFaculty",
				"Faculty visibility value Is required"
			).isBoolean(),
			check(
				"visibleAlumni",
				"Alumni visibility value Is required"
			).isBoolean(),
			check("channel", "Channel is Required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const filter = new Filter();

		var containsBadWords =
			filter.isProfane(req.body.text) ||
			filter.isProfane(req.body.heading);

		if (containsBadWords) {
			console.log();
			return res
				.status(400)
				.json({ errors: [{ msg: "Bad word detected" }] });
		}

		try {
			const user = await User.findById(req.user.id).select("-password");
			console.log(req.body);
			const {
				text,
				heading,
				visibleStudent,
				visibleFaculty,
				visibleAlumni,
				channel,
				images,
			} = req.body;

			visible = [];

			if (visibleStudent) {
				visible.push("student");
			}

			if (visibleAlumni) {
				visible.push("alumni");
			}

			if (visibleFaculty) {
				visible.push("faculty");
			}

			const post_request = new PostRequest({
				heading: heading,
				text: text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
				visibility: visible,
				images: images,
				channel: channel,
			});

			const post = await post_request.save();
			console.log("Post Request sent");
			res.json(post);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("server error in creating post request");
		}
	}
);

// @route    POST api/posts
// @desc     create a Post Directly
// @access   Private

router.post(
	"/create-post",
	[
		auth,
		[
			check("text", "Body Text is required").not().isEmpty(),
			check("heading", "Heading is required").not().isEmpty(),
			check(
				"visibleStudent",
				"Student visibility value Is required"
			).isBoolean(),
			check(
				"visibleFaculty",
				"Faculty visibility value Is required"
			).isBoolean(),
			check(
				"visibleAlumni",
				"Alumni visibility value Is required"
			).isBoolean(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const filter = new Filter();

		var containsBadWords =
			filter.isProfane(req.body.text) ||
			filter.isProfane(req.body.heading);

		if (containsBadWords) {
			console.log();
			return res
				.status(400)
				.json({ errors: [{ msg: "Bad word detected" }] });
		}

		try {
			const user = await User.findById(req.user.id).select("-password");
			console.log(req.body);
			const {
				text,
				heading,
				visibleStudent,
				visibleFaculty,
				visibleAlumni,
				channel,
				images,
			} = req.body;

			var visible = [];

			if (visibleStudent) {
				visible.push("student");
			}

			if (visibleAlumni) {
				visible.push("alumni");
			}

			if (visibleFaculty) {
				visible.push("faculty");
			}

			const result_channel = await Channel.find({ name: channel });

			if (!result_channel) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Channel does not exists" }] });
			}

			const post = new Post({
				user: req.user.id,
				heading,
				text,
				name: user.name,
				avatar: user.avatar,
				visibility: visible,
				images: images,
				channel: channel,
			});

			const pst = await post.save();
			const post_id = pst._id;

			await Channel.findOneAndUpdate(
				{ name: channel },
				{
					$push: { posts: post_id },
				}
			);
			console.log("Post Created");
			res.json(pst);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server error in Create post");
		}
	}
);

// @route    get api/posts/all
// @desc     get all posts
// @access   Private

router.get("/search", auth, async (req, res) => {
	try {
		const searchTerm = req.query.query;
		const channel_name = req.query.channel_name;
		var posts = [];
		if (searchTerm === "") {
			posts = await Post.find({ channel: channel_name }).sort({
				date: -1,
			});
		} else {
			posts = await Post.find(
				{ $text: { $search: searchTerm } },
				{ score: { $meta: "textScore" } }
			).sort({ score: { $meta: "textScore" } });

			const tmp = posts.filter((p) => {
				return p.channel === channel_name;
			});

			posts = tmp;
		}

		res.json(posts);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// @route    get api/posts/:id
// @desc     get post by id
// @access   Private

router.get("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.json(post);
	} catch (error) {
		console.error(error.message);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server Error");
	}
});

// @route    delete api/posts/:id
// @desc     delete post by id
// @access   Private

router.delete("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorised" });
		}
		await post.remove();
		res.json({ msg: "Post removed" });
	} catch (error) {
		console.error(error.message);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server Error");
	}
});

// @route    post api/posts/:post_id/likes
// @desc     Toggle Like of a post
// @access   Private

router.post("/:id/likes", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post === null) {
			return res.status(404).json({ msg: "Post Not found" });
		}
		if (post.user.toString() === req.user.id) {
			return res
				.status(400)
				.json({ msg: "You can't like your own post" });
		}
		const liked = await Post.find({
			_id: req.params.id, //  match post id
			likes: {
				$elemMatch: { user: mongoose.Types.ObjectId(req.user.id) },
			},
		});

		if (liked.length) {
			return res.status(400).json({ msg: "Post already liked" });
		} else {
			// remove from dislikes
			await Post.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$pull: {
						dislikes: {
							user: mongoose.Types.ObjectId(req.user.id),
						},
					},
				}
			);

			await Post.updateOne(
				{ _id: req.params.id },
				{
					$push: {
						likes: { user: mongoose.Types.ObjectId(req.user.id) },
					},
				}
			);
			const updatedPost = await Post.findById(req.params.id);

			const payload = {
				id: post._id,
				likes: updatedPost.likes,
				dislikes: updatedPost.dislikes,
			};

			return res.status(200).json(payload);
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// @route    post api/posts/:post_id/dislikes
// @desc     toggle DisLike of a post
// @access   Private

router.post("/:id/dislikes", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post === null) {
			return res.status(404).json({ msg: "Post Not found" });
		}
		if (post.user.toString() === req.user.id) {
			return res
				.status(400)
				.json({ msg: "You can't dislike your own post" });
		}

		const disliked = await Post.find({
			_id: req.params.id, //  match post id
			dislikes: {
				$elemMatch: { user: mongoose.Types.ObjectId(req.user.id) },
			},
		});

		if (disliked.length) {
			return res.status(400).json({ msg: "Post already disliked" });
		} else {
			// remove from likes
			await Post.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$pull: {
						likes: {
							user: mongoose.Types.ObjectId(req.user.id),
						},
					},
				}
			);
			// add to dislikes
			await Post.updateOne(
				{ _id: req.params.id },
				{
					$push: {
						dislikes: {
							user: mongoose.Types.ObjectId(req.user.id),
						},
					},
				}
			);
			const updatedPost = await Post.findById(req.params.id);

			const payload = {
				id: post._id,
				likes: updatedPost.likes,
				dislikes: updatedPost.dislikes,
			};
			return res.status(200).json(payload);
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// @route    POST api/posts/:id/comments
// @desc     comment on post
// @access   Private
router.post(
	"/:id/comments",
	[auth, [check("text", "Comment cannot be Empty").not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("validation check");

			return res.status(400).json({ errors: errors.array() });
		}

		const filter = new Filter();

		var containsBadWords = filter.isProfane(req.body.text);

		if (containsBadWords) {
			console.log();
			return res
				.status(400)
				.json({ errors: [{ msg: "Bad word detected" }] });
		}

		try {
			const user = await User.findById(req.user.id).select("-password");
			const post = await Post.findById(req.params.id);

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};

			post.comments.unshift(newComment);

			await post.save();
			console.log("comment added to db");
			res.json(post.comments);
		} catch (error) {
			console.log("err block routes");
			console.error(error.message);
			res.status(500).send("server error");
		}
	}
);

// @route    DELETE api/posts/:id/comments/:comment_id
// @desc     delete comment
// @access   Private
router.delete("/:id/comments/:comment_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id
		);

		if (!comment) {
			return res.status(400).json({ msg: "comment does not exist" });
		}

		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorised" });
		}
		post.comments = post.comments.filter((comm) => comm.id !== comment.id);
		await post.save();
		res.json(post.comments);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("server error");
	}
});

// router.get("/search/:query_string", auth, async (req, res) => {
// 	try {
// 		const posts = await Post.find(
// 			{ $text: { $search: req.params.query_string } },
// 			{ score: { $meta: "textScore" } }
// 		).sort({ score: { $meta: "textScore" } });
// 		res.json(posts);
// 	} catch (err) {
// 		console.error(error.message);
// 		res.status(500).send("server error  in posts search");
// 	}
// });

router.get("/settings/get", auth, async (req, res) => {
	try {
		const settings = await Setting.find();
		return res.status(200).json(settings[0].requirePostApproval);
		// return res.status(200).json(true);
	} catch (err) {
		console.log(err);
		res.status(500).send("Server Error");
	}
});

router.put("/settings/set", auth, async (req, res) => {
	try {
		const settings = await Setting.find();
		const id = settings[0]._id;

		if (req.body.requireApproval === "on") {
			req.body.requireApproval = true;
		} else if (req.body.requireApproval === "off") {
			req.body.requireApproval = false;
		}

		await Setting.findOneAndUpdate(
			{ _id: id },
			{ $set: { requirePostApproval: req.body.requireApproval } }
		);
		return res.status(200).json("Settings set success");
	} catch (err) {
		console.log(err);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
