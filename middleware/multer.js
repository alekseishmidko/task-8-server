import express from "express";
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
const storage = multer.memoryStorage(); // Хранить файл в памяти
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 },
});
export default upload;
