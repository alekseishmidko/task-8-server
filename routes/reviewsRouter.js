import express from "express";
export const reviewsRouter = express.Router();

import { auth } from "../utils/auth.js";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getMyReviews,
  getOneReview,
  updateReview,
  getReviewsByUser,
  getRelatedReviews,
} from "../controllers/reviewController.js";
import { handleRatingReview } from "../controllers/ratingController.js";
import { uploadImages } from "../controllers/uploadController.js";
import upload from "../middleware/multer.js";
//api/reviews/upload
reviewsRouter.post("/upload", upload.array("files", 4), uploadImages);
//api/reviews/create
reviewsRouter.post(
  "/create",

  // upload.array("files", 4),
  // uploadImages
  auth,
  createReview
);
//api/reviews/all
reviewsRouter.get("/all", getAllReviews);
//api/reviews/:id
reviewsRouter.get("/:id", getOneReview);
//api/reviews/users/myReviews
reviewsRouter.get("/users/myReviews", auth, getMyReviews);
//api/reviews/:id
reviewsRouter.put("/:id", auth, updateReview);
//api/reviews/:id
reviewsRouter.delete("/:id", auth, deleteReview);
//api/reviews/:id
reviewsRouter.post("/:id", auth, handleRatingReview);
//api/reviews/users/:id
reviewsRouter.get("/users/:id", auth, getReviewsByUser);
//api/reviews/related/:id
reviewsRouter.post("/related/:id", getRelatedReviews);
