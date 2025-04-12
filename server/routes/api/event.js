const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authHeadAdmin = require("../../middleware/authHeadAdmin");
const User = require("../../models/User");
const Event = require("../../models/Event");
const Notification = require("../../models/Notifications");

const sendEmail = require("../../middleware/utils/sendEmail");

const Filter = require("bad-words");
const { check, validationResult } = require("express-validator");
var mongoose = require("mongoose");
const PostRequest = require("../../models/PostRequest");
const Setting = require("../../models/Setting");
const Channel = require("../../models/Channel");
// console.log("hi");    

router.get("/get/getevent", async (req, res) => {
  try {
    const data = await Event.find();
    // const save = await data.save();
    // console.log("events = " ,data);

    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

router.post("/create-event", async (req, res) => {
  try {
    const data = new Event({
      title: req.body.event_name,
      Description: req.body.description,
      Link: req.body.link,
      Event_post_date: Date.now(),
      // Event_date:req.body.event_date,
    });

    const save = await data.save();

    const ppp = new Notification({
      created_by_user: "Admin",
      userID: "6410b5e74dd13341a89a1bb2",
      Notification_name: "Event " + req.body.event_name,
      Notification_link: "http://localhost:3000/events",
      Notification_description: req.body.description,
      Notification_post_date: Date.now(),
    });
    const updating2 = await ppp.save();

    const users = await User.find();
    if (users != undefined) {
      for (let i = 0; i < users.length; i++) {
        // console.log(users[i].email);
        const options = {
          subject: "New Event Posted by Admin",
          html: `Dear ${users[i].name} 
					<br>
					You have new event available,
					 <br>
					 Title: ${req.body.event_name}
					  <br>
					   Description: ${req.body.description}`,

          to: users[i].email,
          from: {
            name: "Alumni Connect",
            address: process.env.EMAIL,
          },
        };

        const pp = await sendEmail(options);
      }
    }
    // console.log("saved ", data);
    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

router.post("/deleteevent", async (req, res) => {
  try {
    const data = await Event.findOne({ _id: req.body.eventID });
    console.log(data.created_by_user, req.body.userID);
    if (
      data.created_by_user != req.body.userID &&
      req.body.userRole != "Admin"
    ) {
      console.log("invaliddd");
      res.json({
        invalid_msg: "invalid",
      });
    } else {
      const save = await Event.deleteOne({ _id: req.body.eventID });
      console.log("deleted ", req.body.userID);
      res.json({
        invalid_msg: "valid",
      });
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
