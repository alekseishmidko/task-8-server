import LikesModel from "../models/Likes.js";
import ReviewsModel from "../models/Reviews.js";
export const handleLike = async (req, res) => {
  const userId = req.user.id;

  const reviewId = req.params.id;
  console.log(userId, reviewId, "body");
  const existingLike = await LikesModel.findOne({ reviewId, userId });
  const existingReview = await ReviewsModel.findOne({ _id: reviewId });
  console.log(existingLike, "exs like", existingReview, "ex rev");
  if (existingLike && existingLike?._id) {
    const deleted = await LikesModel.deleteOne({ _id: existingLike._id });
    res.status(201).send(deleted);
  } else {
    const newLike = await LikesModel({
      userId,
      reviewId,
    });
    console.log(newLike, "new like");
    const like = await newLike.save();
    res.status(201).send({ like });
  }
};

export const likesCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;
    const likes = await LikesModel.find({ userId: userId });
    if (!likes) {
      return res.status(304).json({ message: "likes is empty" });
    }
    const length = likes.length;
    res.status(200).send({ likes, length });
  } catch (error) {
    res.status(500).json({ message: "Error in likesCount" });
  }
};
export const allLikes = async (req, res) => {
  try {
    const allLikes = await LikesModel.find().exec();
    console.log(allLikes);
    if (!allLikes) {
      return res.status(304).json({ message: "likes is empty" });
    }
    res.status(200).send(allLikes);
  } catch (error) {
    res.status(500).json({ message: "Error in AllLikes" });
  }
};
