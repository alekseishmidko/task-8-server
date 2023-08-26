import ReviewsModel from "../models/Reviews.js";
import UsersModel from "../models/Users.js";
function extractHashtags(inputString) {
  const words = inputString.split(/\s+/); // Разбиваем строку на слова
  const hashtags = [];

  words.forEach((word) => {
    if (word.startsWith("#")) {
      hashtags.push(word.substring()); // Удаляем символ #
    }
  });

  return hashtags;
}
export const createReview = async (req, res) => {
  try {
    const { title, group, rating, productId, content } = req.body;
    const userId = req.user._id;
    // Проверяем, существует ли уже обзор от этого пользователя для этого продукта
    const existingReview = await ReviewsModel.findOne({ productId, userId });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product!" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Not authorised" });
    }
    const newReview = await ReviewsModel({
      title,
      group,
      productId,
      userId,
      tags: extractHashtags(content),
      rating,
      //   likes,
      content,
    });
    const review = await newReview.save();
    res.send({ review });
  } catch (error) {
    res.status(500).json({ message: "Error in createReview" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const allReviews = await ReviewsModel.find()
      .sort("createdAt")
      .populate("userId")
      .exec();
    if (!allReviews) {
      return res.json({ message: "there arent reviews" });
    }
    const last6Reviews = await ReviewsModel.find()
      .limit(6)
      .populate("userId")
      .sort("-createdAt");
    const pop6Reviews = await ReviewsModel.find()
      .limit(6)
      .populate("userId")
      .sort("rating");
    res.send({ allReviews, last6Reviews, pop6Reviews });
  } catch (error) {
    res.status(500).json({ message: "Error in getAll reviews" });
  }
};

export const getOneReview = async (req, res) => {
  try {
    const review = await ReviewsModel.findById(req.params.id);
    res.send({ review });
  } catch (error) {
    res.status(500).json({ message: "Error in getOneReview" });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorised" });
    }
    const user = await UsersModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Not found a user! (getMyReviews)" });
    }
    const userReviews = await ReviewsModel.find({ userId });
    res.send(userReviews);
  } catch (error) {
    res.status(500).json({ message: "Error in getMyReviews" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const _id = req.params.id;
    // console.log(userId, "/", _id);

    const { title, group, rating, content } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "not authorised" });
    }
    const existingReview = await ReviewsModel.findOne({ _id, userId });
    // console.log(existingReview);
    if (!existingReview) {
      return res
        .status(404)
        .json({ message: "dont find review! (updateReview)" });
    }
    existingReview.title = title;
    existingReview.tags = extractHashtags(content);

    existingReview.group = group;
    existingReview.rating = rating;
    existingReview.content = content;

    await existingReview.save();

    res.status(200).json({ message: "Review is succesfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Error in updateReview" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const _id = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: "not authorised" });
    }
    const deleteReview = await ReviewsModel.findOneAndDelete({ _id, userId });
    if (!deleteReview) {
      return res.status(404).json({ message: "Review is not found" });
    }
    res.status(200).json({ message: "Обзор успешно удален" });
  } catch (error) {
    res.status(500).json({ message: "Error in deleteReview" });
  }
};
