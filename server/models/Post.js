const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
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
	name: {
		type: String,
	},
	avatar: {
		type: String,
	},
	visibility: [
		{
			type: String,
		},
	],
	likes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: "user",
			},
		},
	],
	channel: {
		type: String,
		required: true,
	},
	dislikes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: "user",
			},
		},
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: "user",
			},
			text: {
				type: String,
				required: true,
			},
			name: {
				type: String,
			},
			avatar: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	images: [String],
	date: {
		type: Date,
		default: Date.now,
	},
});

PostSchema.index({ "$**": "text" });
module.exports = Post = mongoose.model("post", PostSchema);
