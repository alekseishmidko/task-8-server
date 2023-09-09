import express from "express";
export const commentsRouter = express.Router();

import { auth } from "../utils/auth.js";
import {
  createComment,
  getReviewComments,
} from "../controllers/commentsController.js";
//api/comments/
commentsRouter.post("/", auth, createComment);
//api/comments/:id
commentsRouter.get("/:id", getReviewComments);
