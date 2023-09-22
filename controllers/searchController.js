import ReviewsModel from "../models/Reviews.js";
import CommentsModel from "../models/Comments.js";
export const searchReviews = async (req, res) => {
  try {
    const query = req.query.q;
    // console.log(query);
    const reviewsRaw = await ReviewsModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    })
      .populate("ratingFive")
      .exec();

    const reviews = await Promise.all(
      reviewsRaw.map(async (review) => {
        const avgRatingFive =
          review.ratingFive.reduce(
            (sum, rating) => sum + rating.ratingFive,
            0
          ) / review.ratingFive.length;
        return { ...review.toObject(), avgRatingFive };
      })
    );

    const commentsRaw = await CommentsModel.find({
      comment: { $regex: query, $options: "i" },
    }).populate("reviewId");

    const arr = commentsRaw.map((item) => {
      return item.reviewId;
    });
    const uniqueIds = new Set();
    const comments = arr.filter((item) => {
      if (!uniqueIds.has(item._id)) {
        uniqueIds.add(item._id);
        return true;
      }
      return false;
    });
    res.json({ reviews, comments });
  } catch (error) {
    res.status(500).json({ message: "Error in searchReviews" });
  }
};
