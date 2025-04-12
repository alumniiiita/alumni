const router = require("express").Router();
const Message = require("../../models/Message");
const auth = require("../../middleware/auth");
const aes256 = require("aes256");
//add

router.post("/", auth, async (req, res) => {
	try {
		const secret_msg = aes256.encrypt(
			process.env.ENCRYPTION_KEY,
			req.body.text
		);

		const msg_obj = {
			sender: req.body.sender,
			text: secret_msg,
			conversationId: req.body.conversationId,
		};

		const newMessage = await new Message(msg_obj);
		const savedMessage = await newMessage.save();
		const returnObj = savedMessage
		returnObj.text = aes256.decrypt(
			process.env.ENCRYPTION_KEY,
			secret_msg
		);
		res.status(200).json(returnObj);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get

router.get("/:conversationId", auth, async (req, res) => {
	try {
		console.log("ïnside get mesages by conversation ID");
		const messages = await Message.find({
			conversationId: req.params.conversationId,
		});
		
		for (let i = 0; i < messages.length; i++) {
			const decrypted = aes256.decrypt(
				process.env.ENCRYPTION_KEY,
				messages[i].text
			);
			messages[i].text = decrypted;
		}
		res.status(200).json(messages);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

module.exports = router;
