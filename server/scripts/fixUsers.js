const mongoose = require("mongoose");
const User = require("../models/User"); // adjust the path if needed

require("dotenv").config();

const fixUsers = async () => {
	try {
		await mongoose.connect('mongodb+srv://alumnioffice:Alumniconnectiiita5@cluster0.z2x5sv9.mongodb.net/alumni_connect?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        

		await User.updateMany(
			{ friends: { $exists: false } },
			{ $set: { friends: [] } }
		);

		await User.updateMany(
			{ blockedUsers: { $exists: false } },
			{ $set: { blockedUsers: [] } }
		);

		console.log("Users updated successfully ✅");
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

fixUsers();
