import LikesModel from "../models/Likes.js";

export const handleLike = async (req, res) => {
  const userId = req.user.id;

  const reviewId = req.params.id;
  console.log(userId, reviewId);
  const existingLike = await LikesModel.findOne({ reviewId, userId });
  console.log(existingLike, "exs like");
  if (existingLike === null) {
    const newLike = await LikesModel({
      userId,
      reviewId,
    });
    const like = await newLike.save();
    res.status(201).send({ like });
  } else {
    const deleted = await LikesModel.deleteOne({ _id: existingLike._id });
    res.status(201).send(deleted);
  }
};
