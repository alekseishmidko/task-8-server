import express from "express";
export const usersRouter = express.Router();
import {
  signIn,
  signUp,
  current,
  getAllUsers,
} from "../controllers/usersController.js";
import { auth } from "../utils/auth.js";
//api/users/signIn
usersRouter.post("/signIn", signIn);
//api/users/signUp
usersRouter.post("/signUp", signUp);
//api/users/current
usersRouter.get("/current", auth, current);
//api/users/all
usersRouter.get("/all", auth, getAllUsers);
