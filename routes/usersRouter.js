import express from "express";
export const usersRouter = express.Router();
import {
  signIn,
  signUp,
  current,
  getAllUsers,
  deleteUser,
  handleRoleUser,
  getOneUserReviews,
  signUpGoogle,
  handleStatusUser,
} from "../controllers/usersController.js";
import { handleError } from "../utils/errors.js";
import { auth } from "../utils/auth.js";
//api/users/signIn
usersRouter.post("/signIn", signIn);
//api/users/signUp
usersRouter.post("/signUp", signUp);
//api/users/current
usersRouter.get("/current", auth, current);
//api/users/all
usersRouter.get("/all", auth, getAllUsers);
//api/users/:id
usersRouter.delete("/:id", auth, deleteUser);
//api/users/:id
usersRouter.put("/:id", auth, handleRoleUser);
//api/users/:id
usersRouter.get("/:id", auth, getOneUserReviews);

//api/users/google
usersRouter.post("/google", signUpGoogle);
//api/users/:id
usersRouter.post("/status/:id", auth, handleStatusUser);
