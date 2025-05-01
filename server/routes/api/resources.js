const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Resource = require("../../models/Resource");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resources",
    resource_type: "auto"
  },
});

const upload = multer({ storage });

// Upload a resource
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  const { title, topic } = req.body;
  try {
    const resource = new Resource({
      title,
      topic,
      fileUrl: req.file.path,
      uploadedBy: req.user.id,
    });
    await resource.save();
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get all resources with optional filter
router.get("/", async (req, res) => {
  const { topic } = req.query;
  const filter = topic ? { topic } : {};
  const resources = await Resource.find(filter).populate("uploadedBy", ["name"]);
  res.json(resources);
});

module.exports = router;