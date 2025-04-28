const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const uuid4 = require("uuid4");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Job = require("./models/Jobs");
const Authroutes = require("./routes/api/LinkedinRoute.js");
const app = express();
require("dotenv").config();
const http = require("http").createServer(app);
const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Server is up on port ${PORT}`));

const io = require("socket.io")(http, {
	cors: {
		origin: `${process.env.CLIENT_URL}`,
		methods: ["GET" , "POST"]
	},
});

connectDB();

// init middleware for parsing
app.use(cors());
app.use(express.json({ extended: false }));

// app.get("/", (req, res) => res.send("API is running"));

// define routes
app.use('/api/linkedin' , Authroutes);

app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/requests", require("./routes/api/request"));
app.use("/api/blocking", require("./routes/api/blocking"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/friends", require("./routes/api/friends"));
// app.use("/api/jobs", require("./routes/api/jobs"));
app.use("/api/extras", require("./routes/api/extras"));
app.use("/api/conversations", require("./routes/api/conversations"));
app.use("/api/messages", require("./routes/api/messages"));
app.use("/api/channels",require("./routes/api/channel"));
app.use("/awards", express.static(path.join(__dirname, "/images")));

app.use("/api/job", require("./routes/api/jobs"));
app.use("/api/event", require("./routes/api/event"));
app.use("/api/notifications", require("./routes/api/notifications"));


app.use("/api/stories", require("./routes/api/stories"));

app.use('/uploads', express.static('uploads'));




cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinary_storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "AWARDS",
	},
});

var storage_folder = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./images");
	},
	filename: function (req, file, cb) {
		const id = uuid4();
		cb(null, id + file.originalname);
	},
});

const upload = multer({ storage: storage_folder });

// app.use(cors());

// upgradeUser();


	  // Step 3: Fetch LinkedIn Profile Data
	//   const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
	// 	headers: { Authorization: `Bearer ${accessToken}` },
	//   });
  
	  


     
  
 
  
	  // Step 4: Save user data in your database (Example function)
	
  
  // Example function to save user data (Replace with your database logic)
 

app.post("/upload-image", upload.single("file"), function (req, res){
	res.json(req.file.filename);
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
	console.log("New socket connected:", socket.id);

	socket.on("addUser", (userId) => {
		if (userId) {
			console.log("userID",userId)
			onlineUsers.set(userId.toString(), socket.id);
			console.log("user_added",onlineUsers)
		}

	});

	socket.on("joinGroup", (conversationId) => {
		socket.join(conversationId);
		console.log("joined group",conversationId)
	});

	socket.on('sendMessage', ({ senderId, receiverId, conversationId, text, isGroup }) => {

		console.log("isg",isGroup)
		if (isGroup) {
			socket.to(conversationId).emit('receiveMessage', { senderId, text, conversationId });
			console.log("sent message from" ,senderId)
		} else {
			console.log( "receiver",receiverId)
			const receiverSocket = onlineUsers.get(receiverId.toString());
			console.log("recsock",receiverSocket)
			if (receiverSocket) {
				io.to(receiverSocket).emit('receiveMessage', { senderId, text, conversationId });
				// console.log("sent message from" ,senderId)
			}
		}
	});

	socket.on("disconnect", () => {
		for (const [userId, socketId] of onlineUsers) {
			if (socketId === socket.id) {
				onlineUsers.delete(userId);
				break;
			}
		}
		console.log("Socket disconnected:", socket.id);
	});
});

if (process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})
}


// schedule.scheduleJob("*/2 * * * * *", async () => {
// 	//console.log("user upgrade job running");
// 	try {
// 		const users = await User.find();
// 		//console.log(users.length);
// 		for (var i = 0; i < users.length; i++) {
// 			var user = users[i];
// 			//console.log(user.role)
// 			if (
// 				user.role === "student" &&
// 				user.passing_year <= new Date().getFullYear()
// 			) {
// 				user.role = "alumni";
// 				await user.save();
// 			}
// 		}
// 	} catch (err) {
// 		//console.log(err);
// 	}
// });

// app.use(express.static('client/build'));

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// })
