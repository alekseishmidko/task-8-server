import express from "express";
export const productsRouter = express.Router();
import {
  createProduct,
  getAllProducts,
} from "../controllers/productController.js";
import { auth } from "../utils/auth.js";
//api/products/create
productsRouter.post("/create", auth, createProduct);
//api/products/all
productsRouter.get("/all", getAllProducts);
