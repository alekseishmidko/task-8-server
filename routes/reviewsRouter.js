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
} from "../controllers/reviewController.js";
//api/reviews/create
reviewsRouter.post("/create", auth, createReview);
//api/reviews/all
reviewsRouter.get("/all", getAllReviews);
//api/reviews/:id
reviewsRouter.get("/:id", getOneReview);
//api/reviews/user/myReviews
reviewsRouter.get("/user/myReviews", auth, getMyReviews);
//api/reviews/:id
reviewsRouter.put("/:id", auth, updateReview);
//api/reviews/:id
reviewsRouter.delete("/:id", auth, deleteReview);
