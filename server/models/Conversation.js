const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
	{
		members: {
			type: Array,
		},
		isGroup:{
			type:Boolean,
			default: false
		},
		name: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
