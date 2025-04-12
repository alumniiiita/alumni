const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	Description: {
		type: String,
	},
	Link: {
		type: String,
	},
    Event_post_date: {
		type: Date,
	},
    Event_date: {
		type: Date,
	},
	
});

const Event = mongoose.model("Events", EventSchema)

// const data = new Event({
// 	title : "First"
// })

// data.save();

// PostSchema.index({ "$**": "text" });
module.exports = Event ;
