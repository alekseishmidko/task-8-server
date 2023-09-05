import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import { usersRouter } from "./routes/usersRouter.js";
import { productsRouter } from "./routes/productsRouter.js";
import { reviewsRouter } from "./routes/reviewsRouter.js";
import { likesRouter } from "./routes/likesRouter.js";
import { uploadRouter } from "./routes/uploadRouter.js";
import upload from "./middleware/multer.js";
import cloudinary from "./utils/cloudinary.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use("/uploads", express.static("uploads"));

mongoose
  .connect(
    "mongodb+srv://alex:1234@cluster0.gle9jsl.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB is active!");
  })
  .catch((error) => {
    console.log(error, "DB error");
  });

app.listen(3001, (error) => {
  if (error) console.log(error, "err");
  else {
    console.log("3001 is running");
  }
});
//socket
app.use("/api/users/", usersRouter);
app.use("/api/products/", productsRouter);
app.use("/api/reviews/", reviewsRouter);
app.use("/api/likes/", likesRouter);
app.use("/api/upload/", uploadRouter);
