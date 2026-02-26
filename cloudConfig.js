import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

console.log("=== CLOUDINARY CONFIG ===");
console.log("Cloud Name:", process.env.CLOUD_NAME ? "SET" : "NOT SET");
console.log("API Key:", process.env.CLOUD_API_KEY ? "SET" : "NOT SET");
console.log("API Secret:", process.env.CLOUD_API_SECRET ? "SET" : "NOT SET");
console.log("================");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "BookMyStay_DEV",
    allowed_formats: ["png", "jpg", "jpeg"],
  },
});

const upload = multer({ storage });
export default  upload;