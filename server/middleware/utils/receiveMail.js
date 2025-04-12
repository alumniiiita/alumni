const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

require("dotenv").config();
module.exports = receiveMail = (emailOptions, cb) => {
	const auth = {
		auth: {
			api_key: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN,
		},
	};
	
	const transporter = nodemailer.createTransport(
		{
			service: 'gmail',
			auth: {
				user: process.env.AUTH_EMAIL,
				pass: process.env.AUTH_PW,
			},
		}
	);
	// const transporter = nodemailer.createTransport(mailGun(auth));

	transporter.sendMail(emailOptions, function (err, data) {
		if (err) {
			console.log("Error: ", err);
			cb(err, null);
		} else {
			cb(null, data);
		}
	});
};
