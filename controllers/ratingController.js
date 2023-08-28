import RatingsModel from "../models/Rating.js";

export const handleRatingReview = async (req, res) => {
  const userId = req.user.id;
  const reviewId = req.params.id;
  const newRate = req.body.ratingFive;
  const productId = req.params.id;
  console.log(userId, reviewId, productId, newRate);
  const existingRating = await RatingsModel.findOne({ reviewId, userId });
  console.log(existingRating, "exs rating");
  if (existingRating === null) {
    const newRating = await RatingsModel({
      userId,
      reviewId,
      ratingFive: newRate,
    });
    const rating = await newRating.save();
    res.status(201).send({ rating });
  } else {
    const updatedRating = await RatingsModel.findOneAndUpdate(
      { _id: existingRating._id },
      { $set: { ratingFive: newRate } },
      { new: true }
    );
    res.status(201).send({ updatedRating });
  }
};
export const handleRatingProduct = async (req, res) => {
  const userId = req.user.id;
  const reviewId = req.params.id;
  const newRate = req.body.ratingFive;
  const productId = req.params.id;
  console.log(userId, reviewId, productId, newRate);
  const existingRating = await RatingsModel.findOne({ productId, userId });
  console.log(existingRating, "exs rating");
  if (existingRating === null) {
    const newRating = await RatingsModel({
      userId,
      productId,
      ratingFive: newRate,
    });
    const rating = await newRating.save();
    res.status(201).send({ rating });
  } else {
    const updatedRating = await RatingsModel.findOneAndUpdate(
      { _id: existingRating._id },
      { $set: { ratingFive: newRate } },
      { new: true }
    );
    res.status(201).send({ updatedRating });
  }
};
