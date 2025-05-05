const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    text: { type: String },
    media: { type: String },
  },
  { timestamps: true } // ✅ Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('message', MessageSchema);
