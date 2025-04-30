const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const MentorshipRequest = require('../../models/MentorShipRequest');




// Request Mentorship
router.post('/', auth, async (req, res) => {
    const { requestedTo, areaOfHelp, message } = req.body;
    try {
      const newRequest = new MentorShipRequest({
        requestedBy: req.user.id,
        requestedTo,
        areaOfHelp,
        message
      });
      const saved = await newRequest.save();
      res.json(saved);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });


// Get requests received (for alumni/faculty)
router.get('/received', auth, async (req, res) => {
    try {
      const requests = await MentorShipRequest.find({ requestedTo: req.user.id })
        .populate('requestedBy', ['name', 'avatar'])
        .sort({ createdAt: -1 });
      res.json(requests);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

  // Accept/Decline mentorship
router.put('/:id', auth, async (req, res) => {
    try {
      const { status } = req.body;
      const request = await MentorShipRequest.findOneAndUpdate(
        { _id: req.params.id, requestedTo: req.user.id },
        { status },
        { new: true }
      );
      res.json(request);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  module.exports = router;
  