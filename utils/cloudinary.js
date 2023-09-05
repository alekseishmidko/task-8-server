import { v2 as cloudinary } from "cloudinary";
import upload from "../middleware/multer.js";
cloudinary.config({
  cloud_name: "dmpjxhwal",
  api_key: "183523855236985",
  api_secret: "PWtb2r5yo4SK5hTWGMw24eHUGtk",
});
export default cloudinary;
