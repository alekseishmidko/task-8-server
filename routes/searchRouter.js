import express from "express";
export const searchRouter = express.Router();
import { searchReviews } from "../controllers/searchController.js";
import { errorWrap } from "../utils/errors.js";
//api/search/
searchRouter.get("/reviews", searchReviews);
