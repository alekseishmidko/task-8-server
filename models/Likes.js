import { mongoose } from "mongoose";
import ReviewsModel from "./Reviews.js";
const { model } = mongoose;
const LikesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      // required: true,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReviewsModel",
    },
  },
  { timestamps: true }
);

// middleware по поставке лайка или убору лайка с поста

LikesSchema.pre("save", async function (next) {
  // console.log(this.reviewId, "thius");
  if (this.reviewId) {
    const models = this;
    const review = await models
      .model("ReviewsModel")
      .findById({ _id: this.reviewId });
    review.likes = review.likes + 1;
    await review.save();
  }

  next();
});
LikesSchema.pre("deleteOne", async function (next) {
  console.log(this, "thius");
  const models = this;
  const like = await this.model.findById(this.getQuery());
  // console.log(like, "like");

  if (like.reviewId) {
    const review = await ReviewsModel.findById({ _id: like.reviewId });
    console.log(review, "review");
    if (review._id) {
      review.likes = review.likes - 1 <= 0 ? 0 : review.likes - 1;

      await review.save();
    }
  }
  next();
});
// LikesSchema.index({ userId: 1, reviews: 1 }, { unique: true }); // Уникальный индекс для предотвращения повторных лайков
export default mongoose.model("LikesModel", LikesSchema);
//  Likes каждый авторизованный пользователь может поставить лайк обзору (не более 1 лайка от юзера на обзор)
