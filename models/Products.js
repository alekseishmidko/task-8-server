import mongoose from "mongoose";
const ProductsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    group: {
      type: String,
      enum: ["books", "games", "movies", "music"],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
    },
    images: [
      {
        type: String,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReviewsModel",
      },
    ],

    ratingFive: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingsModel",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Метод для обновления среднего рейтинга

export default mongoose.model("ProductsModel", ProductsSchema);
