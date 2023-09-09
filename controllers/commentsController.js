import CommentsModel from "../models/Comments.js";
export const createComment = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const { comment, reviewId } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Not authorised" });
    }
    const newComment = await CommentsModel({
      comment,
      userId,
      reviewId,
    });
    const commentary = await newComment.save();
    res.send({ commentary });
  } catch (error) {
    res.status(500).json({ message: "Error in createComment" });
  }
};

export const getReviewComments = async (req, res) => {
  try {
    const reviewComments = await CommentsModel.find({
      reviewId: req.params.id,
    })
      .sort("createdAt")
      .populate("userId")
      .exec();

    if (!reviewComments) {
      return res.json({ message: "there arent comments" });
    }
    res.status(200).send({ reviewComments });
  } catch (error) {
    res.status(500).json({ message: "Error in getAllComments" });
  }
};
