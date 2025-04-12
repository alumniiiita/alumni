const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	created_by_user: {
		type: String,
		required: true
	},
	userID: {
		type: String,
		required: true
	},
	Job_name: {
		type: String,
		required: true,
	},
	Description: {
		type: String,
	},
	Link: {
		type: String,
	},
    Job_post_date: {
		type: Date,
	},
    Job_deadline: {
		type: Date,
	},
	
});

// PostSchema.index({ "$**": "text" });
module.exports = Job = mongoose.model("job", PostSchema);
