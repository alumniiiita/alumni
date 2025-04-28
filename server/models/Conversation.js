const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
	isGroup: { type: Boolean, default: false },
	groupName: { type: String },
	groupAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	lastMessage: { type: String },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('conversation', ConversationSchema);
