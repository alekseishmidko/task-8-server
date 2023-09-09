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
    });

    // Поиск среди комментариев
    const comments = await CommentsModel.find({
      comment: { $regex: query, $options: "i" }, // Поиск в содержании комментариев
    });

    res.json({ reviews, comments });
  } catch (error) {
    res.status(500).json({ message: "Error in searchReviews" });
  }
};
