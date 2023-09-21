import { body } from "express-validator";
//
export const loginValidation = [
  body("email", "Incorrect email!").isEmail(),
  body("password", "password length should be more then 5 symbols").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Incorrect email!").isEmail(),
  body("password", "password length should be more then 5 symbols").isLength({
    min: 5,
  }),
  body("name", "Name length should be more then 2 synbols").isLength({
    min: 2,
  }),
];
export const reviewCreateValidation = [
  body("title", "Title must be longer 2 symbols")
    .isLength({ min: 3 })
    .isString(),
  body("content", "Content must be longer 2 symbols!")
    .isLength({ min: 3 })
    .isString(),
  body("rating", "Rating must be between 0 and 10").isFloat({
    min: 0,
    max: 10,
  }),
  body("group", "Invalid group value")
    .isIn(["books", "games", "movies", "music"])
    .isString(),
];
export const productCreateValidation = [
  body("title", "Title must be longer 2 symbols!")
    .isLength({ min: 3 })
    .isString(),
  body("group", "Invalid group value")
    .isIn(["books", "games", "movies", "music"])
    .isString(),
];
