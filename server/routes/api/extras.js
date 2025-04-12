const express = require("express");
const router = express.Router();
const Parser = require("json2csv").Parser;
const fs = require("fs");
const Achievement = require("../../models/Achievement");
const FeedBack = require("../../models/FeedBack");
const authAdmin = require("../../middleware/authAdmin");
const receiveMail = require("../../middleware/utils/receiveMail");

router.post("/add-achievement", async (req, res) => {
	const { formInput, imgUrl, proofUrl } = req.body;
	const { name, enrollment_number, program, passing_year, rewards, award_date } =
		formInput;

	try {
		achievement_object = new Achievement({
			name,
			enrollment_number,
			program,
			passing_year,
			rewards,
			award_date,
			imgUrl,
			proofUrl,
		});
		const savedAchievement = await achievement_object.save();
		// console.log(savedAchievement);
		res.json(savedAchievement);
	} catch (err) {
		console.error("error saving achievement to DB");
		res.status(500).json({ errors: [{ msg: "Server Error" }] });
	}
});

router.post("/submit-feedback", async (req, res) => {
	const { name, email, role, feedback } = req.body;

	try {
		feedback_object = new FeedBack({ name, email, role, feedback });
		fd = await feedback_object.save();

		const options = {
			sender: name,
			from: {
				name: name,
				address: email,
			},
			to: process.env.EMAIL,
			subject: `New feedback/Query from ${name}`,
			text: feedback,
		};

		receiveMail(options, function (err, data) {
			if (err) {
				res.status(500).json({ message: "Internal Error" });
			} else {
				res.status({ message: "Email sent!!!" });
			}
		});

		res.json(fd);
	} catch (err) {
		console.error("Error sending feedback");
		res.status(500).json({ errors: [{ msg: "Server Error" }] });
	}
});

router.get("/achievements", authAdmin, async (req, res) => {
	try {
		const achievements = await Achievement.find();
		// console.log(achievements);
		res.json(achievements);
	} catch (err) {
		console.error("Error fetching achievements");
		res.status(500).json({
			errors: [{ msg: "Server Error in fetching achievements" }],
		});
	}
});

router.get("/feedbacks", authAdmin, async (req, res) => {
	try {
		const feedbacks = await FeedBack.find();
		res.json(feedbacks);
	} catch (err) {
		console.error("Error fetching Feedbacks");
		res.status(500).json({
			errors: [{ msg: "Server Error in fetching feedbacks" }],
		});
	}
});

router.delete("/achievements/:id", authAdmin, async (req, res) => {
	try {
		await Achievement.findOneAndDelete(req.params.id);
		res.json(req.params.id);
	} catch (err) {
		console.log(err);
		console.error("Error Deleting Achievement");
		res.status(500).json({
			errors: [{ msg: "Server Error in deleting achievement" }],
		});
	}
});

router.delete("/feedbacks/:id", authAdmin, async (req, res) => {
	try {
		await FeedBack.findByIdAndDelete(req.params.id);
		res.json(req.params.id);
	} catch (err) {
		console.error("Error Deleting feedback");
		res.status(500).json({
			errors: [{ msg: "Server Error in deleting feedback" }],
		});
	}
});

router.delete("/achievements/all", authAdmin, async (req, res) => {
	try {
		await Achievement.deleteMany();
	} catch (err) {
		console.log(err);
		console.error("Error Deleting All Achievements");
		res.status(500).json({
			errors: [{ msg: "Server Error in deleting All achievements" }],
		});
	}
});
module.exports = router;
