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
  signUpFacebook,
} from "../controllers/usersController.js";
import { handleError } from "../utils/errors.js";
import { errorWrap } from "../utils/errors.js";
import { auth } from "../utils/auth.js";
import {
  loginValidation,
  registerValidation,
} from "../validations/validations.js";
import handleValidationError from "../validations/handleValidationError.js";
//api/users/signIn
usersRouter.post("/signIn", loginValidation, handleValidationError, signIn);
//api/users/signUp
usersRouter.post("/signUp", registerValidation, handleValidationError, signUp);
//api/users/current
usersRouter.get("/current", auth, errorWrap(current));
//api/users/all
usersRouter.get("/all", auth, errorWrap(getAllUsers));
//api/users/:id
usersRouter.delete("/:id", auth, errorWrap(deleteUser));
//api/users/:id
usersRouter.put("/:id", auth, errorWrap(handleRoleUser));
//api/users/:id
usersRouter.get("/:id", auth, errorWrap(getOneUserReviews));

//api/users/google
usersRouter.post("/google", errorWrap(signUpGoogle));
//api/users/facebook
usersRouter.post("/facebook", errorWrap(signUpFacebook));
//api/users/:id
usersRouter.post("/status/:id", auth, errorWrap(handleStatusUser));
