require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
	// const oauth2Client = new OAuth2(
	// 	process.env.OAUTH_CLIENT_ID,
	// 	process.env.OAUTH_CLIENT_SECRET,
	// 	"https://developers.google.com/oauthplayground"
	// );

	// oauth2Client.setCredentials({
	// 	refresh_token: process.env.OAUTH_REFRESH_TOKEN,
	// });

	// const accessToken = await new Promise((resolve, reject) => {
	// 	oauth2Client.getAccessToken((err, token) => {
	// 		if (err) {
	// 			reject(err);
	// 		}
	// 		resolve(token);
	// 	});
	// });

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.AUTH_EMAIL,
			pass: process.env.AUTH_PW,
		},
	});

	return transporter;
};

module.exports = sendEmail = async (emailOptions) => {
	let emailTransporter = await createTransporter();
	await emailTransporter.sendMail(emailOptions);
};

// https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a