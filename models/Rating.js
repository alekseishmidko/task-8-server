import { mongoose } from "mongoose";
const { model } = mongoose;
const RatingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: true,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReviewsModel",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductsModel",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RatingsModel", RatingsSchema);
