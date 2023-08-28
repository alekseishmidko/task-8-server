import RatingsModel from "../models/Rating.js";
import ReviewsModel from "../models/Reviews.js";
import ProductsModel from "../models/Products.js";
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
    const review = await ReviewsModel.findOne({ _id: reviewId });
    review.ratingFive.push(rating._id);
    await review.save();
    // db.Product.findOneAndUpdate({ _id: req.params.id }, {$push: {reviews: dbReview._id}}, { new: true });
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
    // const rating = await newRating.save();

    // res.status(201).send({ rating });

    //
    const rating = await newRating.save();
    const product = await ProductsModel.findOne({ _id: productId });
    product.ratingFive.push(rating._id);
    await product.save();
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
