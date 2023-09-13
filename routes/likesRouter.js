import express from "express";
import { errorWrap } from "../utils/errors.js";
export const likesRouter = express.Router();

import { auth } from "../utils/auth.js";

import { handleLike, likesCount } from "../controllers/likesController.js";
//api/likes/handle
likesRouter.post("/:id", auth, errorWrap(handleLike));
//api/likes/
likesRouter.get("/", auth, likesCount);
