import mongoose from "mongoose";
const CommentsSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: true,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReviewssModel",
      required: true,
    },
  },
  { timestamps: true }
);
// Создание текстового индекса для поля comment
CommentsSchema.index({ comment: "text" });
export default mongoose.model("CommentsModel", CommentsSchema);
