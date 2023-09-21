import express from "express";
export const productsRouter = express.Router();
import {
  createProduct,
  getAllProducts,
  getOneProduct,
} from "../controllers/productController.js";
//
import { uploadImages } from "../controllers/uploadController.js";
import upload from "../middleware/multer.js";
//
import { auth } from "../utils/auth.js";
import { handleRatingProduct } from "../controllers/ratingController.js";
import { productCreateValidation } from "../validations/validations.js";
import handleValidationError from "../validations/handleValidationError.js";
//api/products/create
productsRouter.post(
  "/create",
  productCreateValidation,
  handleValidationError,
  auth,
  createProduct
);
//api/products/all
productsRouter.get("/all", getAllProducts);
//api/products/:id
productsRouter.get("/:id", getOneProduct);
//api/products/:id
productsRouter.post("/:id", auth, handleRatingProduct);
