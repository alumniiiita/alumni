const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostRequestSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
	},
	heading: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	name: {
		type: String,
		required: true,
	},
	visibility: [
		{
			type: String,
		},
	],
	channel: {
		type: String,
		required: true,
	},
	images: [String]
});

module.exports = mongoose.model("post-requests", PostRequestSchema);
