import express from "express";
export const commentsRouter = express.Router();
import { errorWrap } from "../utils/errors.js";
import { auth } from "../utils/auth.js";
import {
  createComment,
  getReviewComments,
} from "../controllers/commentsController.js";
//api/comments/
commentsRouter.post("/", auth, errorWrap(createComment));
//api/comments/:id
commentsRouter.get("/:id", errorWrap(getReviewComments));
