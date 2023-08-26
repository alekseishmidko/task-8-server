import mongoose from "mongoose";
const ReviewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      enum: ["books", "games", "movies", "music"],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },

    likes: { type: Number, default: 0 },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentsModel", // Ссылка на модель Comment
      },
    ],
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductsModel",
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("ReviewsModel", ReviewsSchema);
