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
    ratingFive: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingsModel",
        required: true,
      },
    ],

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
    images: [
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
// Создание текстового индекса для полей title и content
ReviewsSchema.index({
  title: "text",
  content: "text",
});
export default mongoose.model("ReviewsModel", ReviewsSchema);
