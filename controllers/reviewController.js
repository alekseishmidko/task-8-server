import ReviewsModel from "../models/Reviews.js";
import UsersModel from "../models/Users.js";
import RatingsModel from "../models/Rating.js";
import { NotFoundException } from "../utils/errors.js";
function extractHashtags(inputString) {
  const words = inputString.split(/\s+/); // Разбиваем строку на слова
  const hashtags = new Set(); // Используем Set для уникальных значений

  words.forEach((word) => {
    if (word.startsWith("#")) {
      const hashtag = word
        .substring()
        .toLowerCase()
        .replace(/[.,\/!$%\^&\*;:{}=\-_`~()]/g, ""); // Удаляем символы #
      hashtags.add(hashtag);
    }
  });

  return Array.from(hashtags);
}
const calcAverageRatingFive = (arr) => {
  if (!arr || arr.length === 0) {
    return 0;
  }

  const totalRating = arr.reduce((sum, item) => sum + item.ratingFive, 0);
  const averageRating = totalRating / arr.length;

  return averageRating;
};
export const createReview = async (req, res) => {
  try {
    const {
      title,
      group,
      rating,
      productId,
      content,
      images,
      createByAdminId,
    } = req.body;

    const userId = req.user._id;
    const a = createByAdminId === 0 ? userId : createByAdminId;
    console.log(a, "a");
    // Проверяем, существует ли уже обзор от этого пользователя для этого продукта
    const existingReview = await ReviewsModel.findOne({ productId, userId: a });
    console.log(req.body, userId, existingReview, "exRev");
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product!" });
    }

    if (!userId && req.user.role === "user") {
      return res.status(401).json({ message: "Not authorised qqq" });
    }
    console.log(">>>>");
    const newReview = await ReviewsModel({
      title: title,
      group: group,
      productId: productId,
      userId: createByAdminId === 0 ? userId : createByAdminId,
      tags: extractHashtags(content),
      rating,
      images,
      content,
    });
    console.log(newReview, "NewReview");
    const review = await newReview.save();
    res.send({ review });
  } catch (error) {
    res.status(500).json({ message: "Error in createReview" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const sortBy = req.query.sortBy;
    console.log(sortBy);
    const parameters = sortBy === "" ? null : { group: sortBy };
    // console.log(parameters);
    //
    const allReviewsRaw = await ReviewsModel.find(parameters)
      .sort("createdAt")
      .populate("userId")
      .populate("ratingFive")
      .exec();
    if (!allReviewsRaw) {
      return res.json({ message: "there arent reviews" });
    }
    const last6ReviewsRaw = await ReviewsModel.find()
      .limit(6)
      .populate("userId")
      .populate("ratingFive")
      .sort("-createdAt")
      .exec();
    const pop6ReviewsRaw = await ReviewsModel.find()
      .limit(6)
      .populate("userId")
      .populate("ratingFive")
      .sort("rating")
      .exec();
    const allUnicTags = [
      ...new Set(allReviewsRaw.flatMap((review) => review.tags)),
    ];
    const allReviews = await Promise.all(
      allReviewsRaw.map(async (review) => {
        const avgRatingFive =
          review.ratingFive.reduce(
            (sum, rating) => sum + rating.ratingFive,
            0
          ) / review.ratingFive.length;
        return { ...review.toObject(), avgRatingFive };
      })
    );
    const last6Reviews = await Promise.all(
      last6ReviewsRaw.map(async (review) => {
        const avgRatingFive =
          review.ratingFive.reduce(
            (sum, rating) => sum + rating.ratingFive,
            0
          ) / review.ratingFive.length;
        return { ...review.toObject(), avgRatingFive };
      })
    );
    const pop6ReviewsWithAvgRatFive = await Promise.all(
      pop6ReviewsRaw.map(async (review) => {
        const avgRatingFive =
          review.ratingFive.reduce(
            (sum, rating) => sum + rating.ratingFive,
            0
          ) / review.ratingFive.length;
        return { ...review.toObject(), avgRatingFive };
      })
    );
    const pop6Reviews = pop6ReviewsWithAvgRatFive.sort(
      (a, b) => b.avgRatingFive - a.avgRatingFive
    );
    const reviewsRatings = await RatingsModel.find({
      reviewId: { $exists: true },
    }).exec();
    // res.send({ reviewsWithAvgRatingFive });
    res.send({
      allUnicTags,
      allReviews,
      last6Reviews,
      pop6Reviews,
      reviewsRatings,
      // reviewsWithAvgRatingFive,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in getAll reviews" });
  }
};

export const getOneReview = async (req, res) => {
  try {
    const review = await ReviewsModel.findById(req.params.id).populate(
      "ratingFive"
    );

    const ratingFive = review.ratingFive;
    const reviewsRatings = await RatingsModel.find({
      reviewId: { $exists: true },
    }).exec();
    const averageRatingFive = calcAverageRatingFive(ratingFive);
    res.send({ review, averageRatingFive, reviewsRatings });
  } catch (error) {
    res.status(500).json({ message: "Error in getOneReview" });
  }
};

export const getMyReviews = async (req, res) => {
  // console.log(req.body);
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Not authorised" });
  }
  const user = await UsersModel.findById(userId);
  if (!user) {
    throw new NotFoundException("Not found a user! (getMyReviews)");
  }
  const userReviews = await ReviewsModel.find({ userId })
    .populate("ratingFive")
    .populate("productId");
  const newData = userReviews.map((item) => {
    const ratingFive = item.ratingFive;
    if (ratingFive.length > 0) {
      const totalRating = ratingFive.reduce(
        (sum, rating) => sum + rating.ratingFive,
        0
      );
      const averageRating = (totalRating / ratingFive.length).toFixed(1);
      return { ...item, averageRatingFive: averageRating };
    } else {
      return { ...item, averageRatingFive: 0 };
    }
  });
  const arr = newData.map((item) => {
    return item._doc;
  });
  const aver = newData.map((item) => {
    return { averageRatingFive: item.averageRatingFive };
  });
  const combinedData = arr
    .map((item, index) => ({
      ...item,
      ...aver[index],
    }))
    .map((item) => ({
      ...item,
      productTitle: item.productId.title,
    }));
  res.send(combinedData);
  // res.send(userReviews);
};

export const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;
    const _id = req.params.id;
    console.log(userId, "userId", _id);
    console.log(req.body.title, "body");
    const { title, group, rating, content } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "not authorised" });
    }

    const existingReview = await ReviewsModel.findOne({ _id });
    console.log(existingReview, "existingReview");
    if (!existingReview) {
      return res
        .status(404)
        .json({ message: "dont find review! (updateReview)" });
    }
    console.log(userId == existingReview.userId);
    //  проверка на роль
    if (
      (user.role === "admin" && user._id !== userId) ||
      (user.role === "superadmin" && user._id !== userId) ||
      existingReview.userId == userId
    ) {
      existingReview.title = title;
      existingReview.tags = extractHashtags(content);

      existingReview.group = group;
      existingReview.rating = rating;
      existingReview.content = content;

      await existingReview.save();

      res.status(200).json({ message: "Review is succesfully updated" });
    } else {
      res.status(401).json({ message: "not authorised! 234" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in updateReview" });
  }
};

export const deleteReview = async (req, res) => {
  const user = req.user;
  const userId = req.user.id;
  const _id = req.params.id;
  try {
    console.log(user.role, "role", userId, _id);
    if (!userId) {
      return res.status(401).json({ message: "not authorised" });
    }

    const review = await ReviewsModel.findById(_id);
    console.log(review.userId, "review", userId);

    if (!review) {
      return res.status(404).json({ message: "Review is not found" });
    }

    // if (
    //   (review.userId == userId && user.role === "user") ||
    //   user.role === "admin" ||
    //   user.role === "superadmin"
    // ) {
    //   return res.status(403).json({ message: "Unauthorized to delete review" });
    // }
    const deleteReview = await ReviewsModel.findByIdAndDelete(_id);
    console.log(deleteReview, "delRev");
    if (!deleteReview) {
      return res.status(500).json({ message: "Failed to delete review" });
    }

    return res.status(200).json({ message: "Review successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error in deleteReview" });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.id;
    // _id здесь это id пользователя, по которому искать все его обзоры
    const _id = req.params.id;
    if (user.role === "admin" || user.role === "superadmin") {
      const reviewsByUser = await ReviewsModel.find({ userId: _id });
      res.send(reviewsByUser);
      if (!reviewsByUser) {
        return res
          .status(500)
          .json({ message: "Failed to get reviews by user" });
      }
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized to get reviews by user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in getReviewsByUser" });
  }
};

export const getRelatedReviews = async (req, res) => {
  try {
    const { productId } = req.body;

    const reviewId = req.params.id;
    console.log(reviewId, productId);
    const relatedReviewsRaw = await ReviewsModel.find({ productId });
    const relatedReviews = relatedReviewsRaw.filter(
      (item) => item._id.toString() !== reviewId
    );
    if (relatedReviews.length > 4) {
      relatedReviews = relatedReviews.slice(0, 4);
    }
    res.status(200).send({ relatedReviews });
  } catch (error) {
    res.status(500).json({ message: "Error in getReviewsByUser" });
  }
};
