const authHeadAdmin = require("../../middleware/authHeadAdmin");
const Channel = require("../../models/Channel");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");


router.post("/create-channel", authHeadAdmin, async (req, res) => {
	try {
		const { new_channel_name } = req.body;
		const channel = new Channel({ name: new_channel_name });
		const channelObj = await channel.save();
		res.status(200).json("Channel Created");
	} catch (err) {
		console.log(err);
		res.status(500).send("Server Error");
	}
});

router.get("/all", auth, async (req, res) => {
    try {
        const channels = await Channel.find();
		console.log("channels = ", channels)
        res.status(200).json(channels);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error in getting all channels");
    }
});
module.exports = router;

