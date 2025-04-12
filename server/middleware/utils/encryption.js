const aes256 = require("aes256");
require("dotenv").config();
const key = process.env.ENCRYPTION_KEY;

var cipher = aes256.createCipher(key);

exports.DoEncrypt = (text) => {
	var encrypted = cipher.encrypt(key, text);
	return encrypted;
};

exports.DoDecrypt = (text) => {
	var decrypted = cipher.decrypt(key, text);
	return decrypted;
};
