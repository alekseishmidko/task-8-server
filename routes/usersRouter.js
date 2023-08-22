import express from "express";
export const usersRouter = express.Router();
import { signIn, signUp, current } from "../controllers/usersController.js";
import { auth } from "../utils/auth.js";
//api/users/signIn
usersRouter.post("/signIn", signIn);
//api/users/signUp
usersRouter.post("/signUp", signUp);
//api/users/current
usersRouter.get("/current", auth, current);
