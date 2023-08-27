import express from "express";
export const likesRouter = express.Router();

import { auth } from "../utils/auth.js";
import { handleLike } from "../controllers/likesController.js";
//api/likes/handle
likesRouter.post("/:id", auth, handleLike);
//api/products/all
