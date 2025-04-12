const express = require("express");
const router = express.Router();
const authAdmin = require("../../middleware/authAdmin");
const JoinRequest = require("../../models/JoinRequest");
const User = require("../../models/User");
const PostRequest = require("../../models/PostRequest");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
var mongoose = require("mongoose");
const Post = require("../../models/Post");
const sendEmail = require("../../middleware/utils/sendEmail");
const Channel = require("../../models/Channel");

// get join requests from db
router.get("/join", authAdmin, async (req, res) => {
	try {
		const requests = await JoinRequest.find();
		res.json(requests);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error");
	}
});

// get join requests by user role  /join/student
router.get("/join/:filter", authAdmin, async (req, res) => {
	try {
		const requests = await JoinRequest.find({ role: req.params.filter });
		res.json(requests);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error");
	}
});

router.get("/post", authAdmin, async (req, res) => {
	try {
		const postRequests = await PostRequest.find();
		res.json(postRequests);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error");
	}
});

// role based filter
router.get("/post/:filter", authAdmin, async (req, res) => {
	try {
		const postRequests = await PostRequest.find({
			role: req.params.filter,
		});
		res.json(postRequests);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error");
	}
});


router.get("/join/:id/approve", authAdmin, async (req, res) => {
	try {
		console.log("Approve join request recieved " + req.params.id);
		const request = await JoinRequest.findById(req.params.id);
		const { name, email, password, role } = request;
		const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

		let user = null;

		if (role === "student") {
			user = new User({
				name,
				email,
				avatar,
				password,
				role,
				program: request.program,
				starting_year: request.starting_year,
				passing_year: request.passing_year,
			});
		} else if (role === "faculty") {
			user = new User({
				name,
				email,
				avatar,
				password,
				role,
				department: request.department,
				designation: request.designation,
			});
		} else {
			user = new User({
				name,
				email,
				avatar,
				password,
				role,
				program: request.program,
				starting_year: request.starting_year,
				passing_year: request.passing_year,
				organisation: request.organisation,
				designation: request.designation,
				location: request.location,
				working_area: request.working_area,
			});
		}

		user.save();

		try {
			await JoinRequest.findOneAndDelete(req.params.id);
			console.log("Join request deleted");
			const options = {
				subject: "Join Request Accepted",
				text: "Congratulations! Your join request has been approved. You can now login into your account.",
				to: email,
				from: {
					name: "Alumni Connect",
					address: process.env.EMAIL,
				},
			};
			sendEmail(options);
		} catch (e) {
			console.log(e);
		}
		res.json({ id: req.params.id });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error");
	}
});

router.get("/join/:id/reject", authAdmin, async (req, res) => {
	try {
		await JoinRequest.findOneAndDelete(req.params.id);
		res.json({ id: req.params.id });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error");
	}
});

router.get("/post/:id/approve", authAdmin, async (req, res) => {
	try {
		console.log("Approve post request recieved " + req.params.id);
		const request = await PostRequest.findById(req.params.id);
		const { heading, text, avatar, user, date, name, visibility, channel, images } =
			request;

		const result_channel = await Channel.find({ name: channel });

		if (!result_channel) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Channel does not exists" }] });
		}

		const post = new Post({
			user,
			heading,
			text,
			avatar,
			date,
			name,
			visibility,
			channel,
			images
		});

		const saved_post = await post.save();

		const post_id = saved_post._id;

		await Channel.findOneAndUpdate(
			{ name: channel },
			{
				$push: { posts: post_id },
			}
		);

		await PostRequest.findOneAndDelete(req.params.id);

		const postuser = await User.findById(user).select("-password");

		const options = {
			subject: "Post Acceepted",
			text: "Congratulations! Your post has been approved. You can now view this post.",
			to: postuser.email,
			from: {
				name: "Alumni Connect",
				address: process.env.EMAIL,
			},
		};

		sendEmail(options);
		res.json({ id: req.params.id });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error in approve post");
	}
});

router.get("/post/:id/reject", authAdmin, async (req, res) => {
	try {
		await PostRequest.findOneAndDelete(req.params.id);
		res.json({ id: req.params.id });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error in reject post");
	}
});

module.exports = router;
