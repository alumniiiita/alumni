const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const JoinRequest = require("../../models/JoinRequest");
const authAdmin = require("../../middleware/authAdmin");
const authHeadAdmin = require("../../middleware/authHeadAdmin");
const receiveMail = require("../../middleware/utils/receiveMail");

// @route    POST api/users/register
// @desc     Register User
// @access   Public
router.post(
	"/register",
	[
		check("name", "Name is required!").not().isEmpty(),
		check("email", "Please include a valid email! ").isEmail(),
		check("password", "Enter a password with 6 or more letters!").isLength({
			min: 6,
		}),
		check("role", "Role is required!").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		console.log(errors);
		if (!errors.isEmpty()) {
			console.log("Returning from  here");
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			name,
			email,
			role,
			password,
			program,
			starting_year,
			passing_year,
			organisation,
			department,
			designation,
			location,
			working_area,
		} = req.body;

		//Check if the user exist
		let user = await User.findOne({ email });

		try {
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User already exists!" }] });
			}

			const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

			request = null;
			if (role === "student") {
				request = new JoinRequest({
					name,
					email,
					password,
					role,
					program,
					starting_year,
					passing_year,
				});
			} else if (role === "faculty") {
				request = new JoinRequest({
					name,
					email,
					password,
					role,
					department,
					designation,
				});
			} else if (role === "alumni") {
				request = new JoinRequest({
					name,
					email,
					password,
					role,
					program,
					starting_year,
					passing_year,
					organisation,
					designation,
					location,
					working_area,
				});
			}
			// user = new User({
			// 	name,
			// 	email,
			// 	avatar,
			// 	password,
			// 	role,
			// 	department,
			// 	designation
			// })

			// user.password = await bcrypt.hash(password, salt);
			// savedUser = await user.save();
			// return res.json(savedUser);
			const salt = await bcrypt.genSalt(10);
			request.password = await bcrypt.hash(password, salt);
			savedRequest = await request.save();
			// console.log("Join Request sent");

			const studentOptions = {
				sender: name,
				from: {
					name: name,
					address: email,
				},
				to: process.env.EMAIL,
				subject: `${name} wants to join IIITA AlumniConnect as a ${role}`,
				html: `<!DOCTYPE html>
				<html lang="en">
					<head>
						<style>
							html {
								text-align: center;
							}
				
							table,
							th,
							td,
							tr {
								border: 10px solid black;
								border-collapse: collapse;
								padding: 100px;
							};
						</style>
				
						<meta charset="UTF-8" />
						<meta http-equiv="X-UA-Compatible" content="IE=edge" />
						<meta name="viewport" content="width=device-width, initial-scale=1.0" />
						<table>
							<tr>
								<td>Name</td>
								<td>${name}</td>
							</tr>
							<tr>
								<td>Batch</td>
								<td>${starting_year}-${passing_year}</td>
							</tr>
							<tr>
								<td>Course</td>
								<td style="text-transform: uppercase">${program}</td>
							</tr>
						</table>
					</head>
					<body></body>
				</html>
				`,
			};

			const facultyOptions = {
				sender: name,
				from: {
					name: name,
					address: email,
				},
				to: process.env.EMAIL,
				subject: `${name} wants to join IIITA AlumniConnect as a ${role}`,
				html: `<!DOCTYPE html>
				<html lang="en">
					<head>
						<style>
							html {
								text-align: center;
							}
				
							table,
							th,
							td,
							tr {
								border: 10px solid black;
								border-collapse: collapse;
								padding: 100px;
							};
						</style>
				
						<meta charset="UTF-8" />
						<meta http-equiv="X-UA-Compatible" content="IE=edge" />
						<meta name="viewport" content="width=device-width, initial-scale=1.0" />
						<table>
							<tr>
								<td>Name</td>
								<td>${name}</td>
							</tr>
							<tr>
								<td>Department</td>
								<td>${department}</td>
							</tr>
							<tr>
								<td>Designation</td>
								<td>${designation}</td>
							</tr>
						</table>
					</head>
					<body></body>
				</html>
				`,
			};

			const alumniOptions = {
				sender: name,
				from: {
					name: name,
					address: email,
				},
				to: process.env.EMAIL,
				subject: `${name} wants to join IIITA AlumniConnect as an ${role}`,
				html: `<!DOCTYPE html>
				<html lang="en">
					<head>
					<style>
					html {
						text-align: center;
					}
		
					table,
					th,
					td,
					tr {
						border: 10px solid black;
						border-collapse: collapse;
						padding: 100px;
					};
				</style>
				
						<meta charset="UTF-8" />
						<meta http-equiv="X-UA-Compatible" content="IE=edge" />
						<meta name="viewport" content="width=device-width, initial-scale=1.0" />
						<table>
							<tr>
								<td>Name</td>
								<td>${name}</td>
							</tr>
							<tr>
								<td>Batch</td>
								<td>${starting_year}-${passing_year}</td>
							</tr>
							<tr>
								<td>Course</td>
								<td style="text-transform: uppercase">${program}</td>
							</tr>
							<tr>
								<td>Working at</td>
								<td>${organisation}, ${location}</td>
							</tr>
							<tr>
								<td>Position</td>
								<td>${designation}</td>
							</tr>
						</table>
					</head>
					<body></body>
				</html>
				
				`,
			};

			let options = null;

			if (role === "student") {
				options = studentOptions;
			} else if (role === "faculty") {
				options = facultyOptions;
			} else {
				options = alumniOptions;
			}
			receiveMail(options, function (err, data) {
				if (err) {
					console.log(err," error in sending mail");
					// res.status(500).json({ message: "Internal Error" });
				} else {
					res.json({ message: "Email sent!", savedRequest });
				}
			});

			// res.json(savedRequest);
			// const payload = {
			// 	user: {
			// 		id: user.id,
			// 	},
			// };

			// // sign the payload with private key
			// jwt.sign(payload, config.get("privateKey"), { expiresIn: 360000 },(err, token) => {
			// 		if (err) throw err;
			// 		//Return Jsonwebtoken
			// 		res.json({ token });
			// 	}
			// );
		} catch (err) {
			console.log(err);
			res.status(500).send("Server error in registering user");
		}
	}
);

// @route    GET api/users/me
// @desc     get current user
// @access   Private

router.get("/me", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error in getting current user" });
	}
});

// @route    GET api/users/all
// @desc     get all Users
// @access   Private

router.get("/search/:query", auth, async (req, res) => {
	try {
		const searchTerm = req.params.query;
		console.log(searchTerm);
		var users = [];
		if (searchTerm === "all") {
			users = await User.find();
			console.log("inside get all user api");
			if (users) {
				console.log("NON ZERO USERS" + users.length);
			}
		} else {
			console.log("inside search users");
			users = await User.find(
				{ $text: { $search: searchTerm } },
				{ score: { $meta: "textScore" } }
			).sort({ score: { $meta: "textScore" } });
			if (users) {
				console.log("NON zero search USERS" + users.length);
			}
		}
		res.json(users);
	} catch (err) {
		// console.error(err.message);
		res.status(500).json({ msg: "Server Error in getting all Users" });
	}
});

// @route    GET api/users/:user_id
// @desc     get user by id
// @access   Private

router.get("/:user_id", auth, async (req, res) => {
	try {
		const user = await User.findById(req.params.user_id).select(
			"-password"
		);

		if (!user) {
			return res.status(400).json({ msg: "User profile not found!" });
		}

		res.json(user);
	} catch (error) {
		console.error(error.message);
		if (error.kind == "ObjectId") {
			return res
				.status(400)
				.json({ msg: "catch block: Profile not found!" });
		}
		res.status(500).json({
			msg: "Server Error in catch block get user by id",
		});
	}
});

// @route    GET api/users/:id/make-admin
// @desc     make admin
// @access   Private

router.get("/:id/make-admin", authHeadAdmin, async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.params.id },
			{ isAdmin: true, adminType: "sub" },
			{ new: true }
		);
		res.json(updatedUser);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error in Make Admin" });
	}
});

// @route    GET api/users/:id/remove-admin
// @desc     remove admin
// @access   Private

router.get("/:id/remove-admin", authHeadAdmin, async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.params.id },
			{ isAdmin: false, $unset: { adminType: "" } },
			{ new: true }
		);
		res.json(updatedUser);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error in Removing Admin" });
	}
});


// @route    DELETE api/users
// @desc     delete user and his posts
// @access   Private

router.delete("/", auth, async (req, res) => {
	try {
		await Post.deleteMany({ user: req.user.id });
		await User.findOneAndRemove({ _id: req.user.id });
		res.json({ msg: "User Deleted" });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: "Server Error in catch block delete" });
	}
});

// @route    PUT api/users/experience
// @desc     add profile experience
// @access   Private

router.put(
	"/experience",
	[
		auth,
		[
			check("title", "Title is Required").not().isEmpty(),
			check("company", "Company name required").not().isEmpty(),
			check("from", "From date is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } =
			req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			const user = await User.findById(req.user.id).select("-password");
			// unshift adds to beginning of array
			user.experience.unshift(newExp);
			await user.save();
			res.json(user);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error in experience");
		}
	}
);

// @route    delete api/users/experience/:exp_id
// @desc     delete profile experience
// @access   Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		// get index of experience to remove
		const removeIndex = user.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);

		user.experience.splice(removeIndex, 1);
		await user.save();
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error in Deleting experience");
	}
});

// @route    PUT api/users/education
// @desc     add education
// @access   Private

router.put(
	"/education",
	[
		auth,
		[
			check("school", "School is Required").not().isEmpty(),
			check("degree", "Degree is required").not().isEmpty(),
			check("fieldofstudy", "Field of Study is required").not().isEmpty(),
			check("from", "From date is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body;

		const newEducation = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const user = await User.findById(req.user.id).select("-password");
			// unshift adds to beginning of array
			user.education.unshift(newEducation);
			await user.save();
			res.json(user);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error in education");
		}
	}
);

// @route    delete api/users/education/:edu_id
// @desc     delete profile education
// @access   Private

router.delete("/education/:edu_id", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		// get index of experience to remove
		const removeIndex = user.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);

		user.education.splice(removeIndex, 1);
		await user.save();
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error in Deleting Education");
	}
});

// @route    GET api/users/:user_id/block
// @desc     Block a user given user_id
// @access   Private

router.get("/:id/block", authHeadAdmin, async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.params.id },
			{ blocked: true },
			{ new: true }
		);
		if (updatedUser === null) {
			res.json("user is coming null");
		}
		res.json(updatedUser);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error in Block User" });
	}
});

// @route    GET api/users/:user_id/unblock
// @desc     UnBlock a user given user_id
// @access   Private

router.get("/:id/unblock", authHeadAdmin, async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.params.id },
			{ blocked: false },
			{ new: true }
		);
		res.json(updatedUser);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error in Unblock user" });
	}
});

//get current user's friends
router.get("/friends/:userId", auth, async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Current User not exists" }] });
		}
		
		// people who I follow and who follow me (common ones)
		let friend_IDs = user.followings.filter((x) =>
			user.followers.includes(x)
		);

		let friends = [];
		for (let i = 0; i < friend_IDs.length; i++) {
			const us = await User.findById(friend_IDs[i]).select("-password");
			friends.push(us);
		}
		res.status(200).json(friends);
	} catch (err) {
		res.status(500).json(err);
	}
});

//follow a user

router.put("/:id/follow", auth, async (req, res) => {
	if (req.user.id !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);

			if (!user.followers.includes(req.user.id)) {
				const updated_profile = await User.findOneAndUpdate(
					{ _id: req.params.id },
					{ $push: { followers: req.user.id } },
					{ new: true }
				);

				const updated_current_user = await User.findOneAndUpdate(
					{ _id: req.user.id },
					{
						$push: { followings: req.params.id },
					},
					{ new: true }
				);

				res.status(200).json({
					followers: updated_profile.followers,
					followings: updated_current_user.followings,
				});
			} else {
				res.status(403).json("you allready follow this user");
			}
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you cant follow yourself");
	}
});

//unfollow a user

router.put("/:id/unfollow", auth, async (req, res) => {
	if (req.user.id !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);

			if (user.followers.includes(req.user.id)) {
				const updated_profile = await User.findOneAndUpdate(
					{ _id: req.params.id },
					{ $pull: { followers: req.user.id } },
					{ new: true }
				);
				const updated_current_user = await User.findOneAndUpdate(
					{ _id: req.user.id },
					{ $pull: { followings: req.params.id } },
					{ new: true }
				);
				res.status(200).json({
					followers: updated_profile.followers,
					followings: updated_current_user.followings,
				});
			} else {
				res.status(403).json("you dont follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you cant unfollow yourself");
	}
});

router.get("/type/:user_type", auth, async (req, res) => {
	try {
		let users = null;
		if (req.params.user_type === "admin") {
			users = await User.find({ isAdmin: true }).select("-password");
		} else {
			users = await User.find({ role: req.params.user_type }).select(
				"-password"
			);
		}
		return res.status(200).json(users);
	} catch (err) {
		res.status(500).json("Server Error");
	}
});

// router.get("/github/:username", (req, res) => {
// 	try {
// 		const options = {
// 			uri: `https://api.github.com/users/${
// 				req.params.username
// 			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
// 				"githubClientId"
// 			)}&client_secret=${config.get("githubSecret")}`,
// 			method: "GET",
// 			headers: { "user-agent": "node.js" },
// 		};

// 		request(options, (error, response, body) => {
// 			if (error) console.log(error);
// 			if (response.statusCode !== 200) {
// 				return res.status(404).json({ msg: "Github User not found" });
// 			}
// 			res.json(JSON.parse(body));
// 		});
// 	} catch (err) {
// 		console.error(err.message);
// 		res.status(500).send("Server Error");
// 	}
// });

module.exports = router;
