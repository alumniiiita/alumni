const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	enrollment_number: {
		type: String,
		required: false,
	},
	program: {
		type: String,
		required: true,
	},
	passing_year: {
		type: String,
		required: true,
	},
	reward: {
		title: { type: String, required: true },
		type: { type: String, required: true },
		organization: { type: String, required: true },
		receivedBy: { type: String, required: true },
		cashPrize: { type: String, required: true },
	},
	award_date: {
		type: String,
		required: true,
	},
	imgUrl: {
		type: String,
	},
	proofUrl: {
		type: String,
	},
});

module.exports = mongoose.model("achievement", AchievementSchema);
