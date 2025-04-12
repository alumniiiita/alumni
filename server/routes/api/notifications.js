const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authHeadAdmin = require("../../middleware/authHeadAdmin");
const User = require("../../models/User");


const Filter = require("bad-words");
const { check, validationResult } = require("express-validator");
var mongoose = require("mongoose");
const PostRequest = require("../../models/PostRequest");
const Setting = require("../../models/Setting");
const Notification = require("../../models/Notifications");

router.post("/getNotifications", async (req, res) => {
  try {
    const id = await User.findById(req.body.userID);
    // console.log(id);
    let ID = {
      id : 0
    }
    if(id != undefined){
      if(id.notificationID == undefined){
        const update2 = await User.findByIdAndUpdate(req.body.userID,{
          notificationID : 15
        });
        ID.id = 15;
        // console.log("added")
      }
      else{
        ID.id = id.notificationID
      }
      // ID.id = id.notificationID
    }

    const data = await Notification.find();

    res.json({data , ID});
  } catch (e) {
    console.log(e);
  }
});


router.post("/addNotifications", async (req, res) => {
    try {
      const ppp = new Notification({
		created_by_user: req.body.user_name ,
        userID: 4522,
        Notification_name: "temp",
        Notification_link: "saf",
        Notification_description: "description"
        // Notification_post_date: 

	})
	const updating2 = await ppp.save();

      res.json(data);
    } catch (e) {
      console.log(e);
    }
  });

  router.post("/updateId", async (req, res) => {
    try {

      const data = await Notification.find();

      const update2 = await User.findByIdAndUpdate(req.body.userID,{
        notificationID : data.length
      });
      // console.log("Noti id updated for ",req.body.userID , " to ",data.length)
      res.json(data);
    } catch (e) {
      console.log(e);
    }
  });

  

module.exports = router;
