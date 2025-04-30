const mongoose = require('mongoose');

const MentorshipRequestSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  requestedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  areaOfHelp: {
    type: String,
    enum: ['Career', 'Research', 'Higher Studies', 'Entrepreneurship', 'Placements', 'Other'],
    required: true
  },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('mentorship_request', MentorshipRequestSchema);