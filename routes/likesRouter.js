import express from "express";
import { errorWrap } from "../utils/errors.js";
export const likesRouter = express.Router();

import { auth } from "../utils/auth.js";

import {
  allLikes,
  handleLike,
  likesCount,
} from "../controllers/likesController.js";
//api/likes/:id
likesRouter.post("/:id", auth, errorWrap(handleLike));
//api/likes/:id
likesRouter.get("/", auth, likesCount);
//api/likes/
likesRouter.get("/all", allLikes);
