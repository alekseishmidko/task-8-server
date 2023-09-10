import ReviewsModel from "../models/Reviews.js";
import CommentsModel from "../models/Comments.js";
export const searchReviews = async (req, res) => {
  try {
    const query = req.query.q;
    console.log(query);
    // Используйте Mongoose для выполнения поиска
    // const results = await ReviewsModel.find({ $text: { $search: query } });
    const reviews = await ReviewsModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // Поиск в заголовках обзоров
        { content: { $regex: query, $options: "i" } }, // Поиск в содержании обзоров
      ],
    }).populate();

    // Поиск среди комментариев
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
