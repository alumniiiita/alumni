const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	linkedinId:{
       type: String,
	   unique: true,
	   sparse: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	friends:[String],
	blocked:[String],
	online:{
      type:Boolean,
	  default:false
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	adminType: {
		type: String,
		required: false,
	},
	blocked: {
		type: Boolean,
		default: false,
	},
	program: {
		type: String,
		required: false,
	},
	starting_year: {
		type: String,
		required: false,
	},
	passing_year: {
		type: String,
		required: false,
	},
	organisation: {
		type: String,
		required: false,
	},
	department: {
		type: String,
		required: false,
	},
	location: {
		type: String,
		required: false,
	},
	designation: {
		type: String,
		required: false,
	},
	working_area: {
		type: String,
		required: false,
	},
	notificationID :{
		type : Number
	},
	images: [String],
	skills: {
		type: [String],
		required: false,
	},
	bio: {
		type: String,
	},
	followers: {
		type: Array,
		default: [],
	},
	followings: {
		type: Array,
		default: [],
	},
	NotificationID : {
		type : Number,
		default : 0
	},
	experience: [
		{
			title: {
				type: String,
				required: true,
			},
			company: {
				type: String,
				required: true,
			},
			website: {
				type: String,
			},
			location: {
				type: String,
			},
			from: {
				type: Date,
				required: true,
			},
			to: {
				type: Date,
			},
			current: {
				type: Boolean,
				default: false,
			},
			description: {
				type: String,
			},
		},
	],
	education: [
		{
			school: {
				type: String,
				required: true,
			},
			degree: {
				type: String,
				required: true,
			},
			fieldofstudy: {
				type: String,
				required: true,
			},
			from: {
				type: Date,
				required: true,
			},
			to: {
				type: Date,
			},
			current: {
				type: Boolean,
				default: false,
			},
			description: {
				type: String,
			},
		},
	],
	social: {
		youtube: {
			type: String,
		},
		linkedin: {
			type: String,
		},
		twitter: {
			type: String,
		},
		facebook: {
			type: String,
		},
		instagram: {
			type: String,
		},
	},
	date: {
		type: Date,
		default: Date.now,
	},
	company: {
		type: String,
	},
	website: {
		type: String,
	},
	status: {
		type: String,
		required: false,
	},
	githubusername: {
		type: String,
	},
});


const adminData = new mongoose.model("user", UserSchema);
const fun = async() =>{

	const salt = await bcrypt.genSalt(10);
	const pass = await bcrypt.hash("Alumniconnect@5", salt);
	const ppp = await new adminData({
		email: "alumni.office@iiita.ac.in",
		password: pass,
		isAdmin: true,
		adminType : "head",
		name: "Santosh Choubey",
		role :"Admin"
	})
	//const updating2 = await ppp.save();
}

	//fun();
	
	
	UserSchema.index({ "$**": "text" });
	module.exports = mongoose.model("user", UserSchema);
