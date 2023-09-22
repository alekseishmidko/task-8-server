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
import { errorWrap } from "../utils/errors.js";
import { reviewCreateValidation } from "../validations/validations.js";
import handleValidationError from "../validations/handleValidationError.js";
//api/reviews/upload
reviewsRouter.post("/upload", upload.array("files", 4), uploadImages);
//api/reviews/create
reviewsRouter.post(
  "/create",
  reviewCreateValidation,
  handleValidationError,
  auth,
  createReview
);
//api/reviews/all
reviewsRouter.get("/all", errorWrap(getAllReviews));
//api/reviews/:id
reviewsRouter.get("/:id", errorWrap(getOneReview));
//api/reviews/users/myReviews
reviewsRouter.get("/users/myReviews", auth, errorWrap(getMyReviews));
//api/reviews/:id
reviewsRouter.put("/:id", auth, errorWrap(updateReview));
//api/reviews/:id
reviewsRouter.delete("/:id", auth, errorWrap(deleteReview));
//api/reviews/:id
reviewsRouter.post("/:id", auth, errorWrap(handleRatingReview));
//api/reviews/users/:id
reviewsRouter.get("/users/:id", auth, errorWrap(getReviewsByUser));
//api/reviews/related/:id
reviewsRouter.post("/related/:id", errorWrap(getRelatedReviews));
