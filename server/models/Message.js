const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation' },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	text: { type: String },
	media: { type: String }, // image/file optional
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('message', MessageSchema);
