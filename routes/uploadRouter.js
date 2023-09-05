import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
export const uploadRouter = express.Router();
import upload from "../middleware/multer.js";
// import { auth } from "../utils/auth.js";

// //api/upload/
uploadRouter.post("/", upload.array("image", 2), uploadImages);
