import { mongoose } from "mongoose";
import ReviewsModel from "./Reviews.js";
// const { model } = mongoose;
import { model } from "mongoose";
const LikesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: true,
      unique: false,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReviewsModel",
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

// middleware по поставке лайка или убору лайка с поста
LikesSchema.pre("save", async function (next) {
  console.log(this, "this");
  if (this.reviewId) {
    const models = this;
    console.log(model, "model");
    const review = await models
      .model("ReviewsModel")
      .findById({ _id: this.reviewId });

    if (review) {
      // Проверка, что review не равно null
      review.likes = review.likes + 1;
      await review.save();
    }
  }

  next();
});
LikesSchema.pre("deleteOne", async function (next) {
  try {
    console.log(this, "thius");
    console.log(model, "model");
    const models = this;
    const like = await this.model.findById(this.getQuery());
    console.log(like, "like");

    if (like.reviewId) {
      const review = await ReviewsModel.findById({ _id: like.reviewId });
      console.log(review, "review");
      if (review && review?._id) {
        review.likes = review.likes - 1 <= 0 ? 0 : review.likes - 1;

        await review.save();
      }
    }
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

//
//
// LikesSchema.pre("save", async function (next) {
//   if (this.reviewId) {
//     const existingLike = await this.model("LikesModel").findOne({
//       reviewId: this.reviewId,
//       userId: this.userId,
//     });

//     if (!existingLike) {
//       const review = await this.model("ReviewsModel").findById({
//         _id: this.reviewId,
//       });

//       if (review) {
//         review.likes = review.likes + 1;
//         await review.save();
//       }
//     }
//   }

//   next();
// });

// LikesSchema.pre("deleteOne", async function (next) {
//   try {
//     const like = await this.model.findOne(this.getQuery());

//     if (like && like.reviewId) {
//       const review = await ReviewsModel.findById({ _id: like.reviewId });

//       if (review && review._id) {
//         review.likes = Math.max(0, review.likes - 1); // Убедимся, что likes не меньше 0
//         await review.save();
//       }
//     }

//     next();
//   } catch (error) {
//     console.error(error);
//     next();
//   }
// });

export default mongoose.model("LikesModel", LikesSchema);
//  Likes каждый авторизованный пользователь может поставить лайк обзору (не более 1 лайка от юзера на обзор)
