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
app.use("/api/posts", require("./routes/api/posts"));
// app.use("/api/jobs", require("./routes/api/jobs"));
app.use("/api/extras", require("./routes/api/extras"));
app.use("/api/conversations", require("./routes/api/conversations"));
app.use("/api/messages", require("./routes/api/message"));
app.use("/api/channels",require("./routes/api/channel"));
app.use("/awards", express.static(path.join(__dirname, "/images")));

app.use("/api/job", require("./routes/api/jobs"));
app.use("/api/event", require("./routes/api/event"));
app.use("/api/notifications", require("./routes/api/notifications"));





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

let users = [];

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
	//take userId and socketId from user
	socket.on("addUser", (userId) => {
		addUser(userId, socket.id);
		io.emit("getUsers", users);
	});

	//send and get message
	socket.on("sendMessage", ({ senderId, receiverId, text }) => {
		const user = getUser(receiverId);
		if (user) {
			io.to(user.socketId).emit("getMessage", {
				senderId,
				text,
			});
		}
	});

	//when disconnect
	socket.on("disconnect", () => {
		removeUser(socket.id);
		io.emit("getUsers", users);
	});
});

if (process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})
}


// schedule.scheduleJob("*/2 * * * * *", async () => {
// 	console.log("user upgrade job running");
// 	try {
// 		const users = await User.find();
// 		console.log(users.length);
// 		for (var i = 0; i < users.length; i++) {
// 			var user = users[i];
// 			console.log(user.role)
// 			if (
// 				user.role === "student" &&
// 				user.passing_year <= new Date().getFullYear()
// 			) {
// 				user.role = "alumni";
// 				await user.save();
// 			}
// 		}
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

// app.use(express.static('client/build'));

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// })
