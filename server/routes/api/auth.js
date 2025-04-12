const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../middleware/utils/sendEmail");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get("/", auth, async (req, res) => {
	try {
		// .select('-passowrd') leaves the password and returns left data
		console.log("user id ", req);
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Auth Error");
	}
});

// @route    POST api/auth
// @desc     authenticate user and get token
// @access   Public
router.post(
	"/",
	[
		check("email", "Please include a valid email! ").isEmail(),
		check("password", "Password Required").exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		//Check if the user exist
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid credentials" }] });
			}

			if (user.blocked) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Account Blocked" }] });
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid credentials" }] });
			}

			const payload = {
				user: {
					id: user.id,
					isAdmin: user.isAdmin,
					adminType: user.adminType,
				},
			};

			// sign the payload with private key
			jwt.sign(
				payload,
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					//Return Jsonwebtoken
					res.json({
						 token : {token} , 
						user_data : user
						});
				}
			);

			
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error.");
		}
	}
);

router.post(
	"/forgot-password",
	[
		check("email", "Please include a valid email! ")
			.isEmail()
			.not()
			.isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("found errors");
			console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}
		const { email } = req.body;
		try {
			const user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Account not found" }] });
			}
			

			const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
			const payload = { user: { id: user.id } };

			const token = jwt.sign(payload, secret, { expiresIn: "5m" });

			// return res.status(200).json(`resetPassword/${user.id}/${token}`);
			const options = {
				subject: "Reset Password Link",
				text: `Please click the following link to reset password for your account. Note: This link is valid only for 5 mins. ${process.env.CLIENT_URL}/resetPassword/${user.id}/${token}`,

				to: email,
				from: {
					name: "Alumni Connect",
					address: process.env.EMAIL,
				},
			};

			sendEmail(options);
			return res.status(200).send("Email sent");
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error.");
		}
	}
);

router.post(
	"/reset-password",
	[
		check("password", "Password Required").not().isEmpty().isLength({
			min: 6,
		}),
		check("password_confirm", "Confirm Password is required")
			.not()
			.isEmpty()
			.isLength({
				min: 6,
			}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { password, password_confirm, user_id, reset_token } = req.body;

		try {
			if (password !== password_confirm) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Passwords do not match" }] });
			}

			const user = await User.findOne({ _id: user_id });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Request" }] });
			}
			const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
			const payload = jwt.verify(reset_token, secret);
			
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();
			
			return res.status(200).send("Password Reset success");
		} catch (err) {
			res.status(500).send("Server error.");
		}
	}
);

router.post("/verify-reset-link", async (req, res) => {
	const { user_id, reset_token } = req.body;
	try {
		const user = await User.findOne({ _id: user_id });
		if (!user) {
			console.log("hello");
			return res
				.status(400)
				.json({ errors: [{ msg: "Invalid Request" }] });
		}
	} catch (err) {
		return res.status(500).json({ errors: [{ msg: "Invalid Request" }] });
	}
	try {
		const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
		const payload = jwt.verify(reset_token, secret);
		console.log("payload" + payload);
		if (!payload) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Invalid Request" }] });
		}
	} catch (err) {
		res.status(500).json({ errors: [{ msg: "Invalid Request" }] });
	}
});
module.exports = router;
