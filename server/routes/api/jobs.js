const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authHeadAdmin = require("../../middleware/authHeadAdmin");
const User = require("../../models/User");
const Job = require("../../models/Jobs");
const Notification = require("../../models/Notifications");

const sendEmail = require("../../middleware/utils/sendEmail");

const Filter = require("bad-words");
const { check, validationResult } = require("express-validator");
var mongoose = require("mongoose");
const PostRequest = require("../../models/PostRequest");
const Setting = require("../../models/Setting");
const Channel = require("../../models/Channel");

router.get("/get/getjob", async (req, res) => {
  try {
    const data = await Job.find();
    let dt = [];
    let archive = [];
    let currDate = new Date;
    console.log("data ",data.length);
    for(let i = 0;i<data.length;i++){
      if(data[i].Job_deadline >= currDate) dt.push(data[i]);
      else{
        console.log(data[i].Job_name)
        archive.push(data[i]);
      }
    }
    // const save = await data.save();
    console.log("dt = " ,dt.length);
    res.json({dt,archive});
  } catch (e) {
    console.log(e);
  }
});

router.post("/create-job", async (req, res) => {
  try {
    const data = new Job({
      created_by_user: req.body.username,
      userID: req.body.userID,
      Job_name: req.body.job_name,
      Description: req.body.description,
      Link: req.body.link,
      Job_post_date: Date.now(),
      Job_deadline: req.body.job_deadline,
    });

    const save = await data.save();

    const ppp = new Notification({
      created_by_user: req.body.username ,
          userID: req.body.userID,
          Notification_name: "Job :- " + req.body.job_name,
          Notification_link: "http://localhost:3000/jobs",
          Notification_description: req.body.description,
          Notification_post_date: Date.now()
    })
    const updating2 = await ppp.save();

    const users = await User.find();
    if (users != undefined) {
      for (let i = 0; i < users.length; i++) {
        // console.log(users[i].email);
        const options = {
          subject: `New Job Posted by ${req.body.username}`,
          html: `Dear ${users[i].name} 
					<br>
					You have new Job available,
					 <br>
					 <br>
					 Title: ${req.body.job_name}
					  <br>
					  <br>
					   Description: ${req.body.description}
					   <br>
					  <br>
					   Link : ${req.body.link}
					   <br>
					  <br>

					   Deadline : ${req.body.job_deadline}
					   `,
          to: users[i].email,
          from: {
            name: "Alumni Connect",
            address: process.env.EMAIL,
          },
        };

        const pp = await sendEmail(options);
      }
    }
// 
    // console.log("saved Job");
    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

router.post("/deletejob", async (req, res) => {
  try {
    const data = await Job.findOne({ _id: req.body.jobID });
    // console.log(data.created_by_user, req.body.jobID,req.body.userID);
    if (
      data.userID != req.body.userID &&
      req.body.userRole != "Admin"
    ) {
      console.log("invaliddd");
      res.json({
        invalid_msg: "invalid",
      });
    } else {
      const save = await Job.deleteOne({ _id: req.body.jobID });
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
