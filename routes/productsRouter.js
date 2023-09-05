import express from "express";
export const productsRouter = express.Router();
import {
  createProduct,
  getAllProducts,
} from "../controllers/productController.js";
//
import { uploadImages } from "../controllers/uploadController.js";
import upload from "../middleware/multer.js";
//
import { auth } from "../utils/auth.js";
import { handleRatingProduct } from "../controllers/ratingController.js";
//api/products/create
productsRouter.post(
  "/create",
  auth,
  upload.array("files", 4),
  uploadImages,
  createProduct
);
//api/products/all
productsRouter.get("/all", getAllProducts);
//api/products/:id
productsRouter.post("/:id", auth, handleRatingProduct);
//api/products/test
// productsRouter.post("/test", auth, createTest);
