import LikesModel from "../models/Likes.js";

export const handleLike = async (req, res) => {
  const userId = req.user.id;

  const reviewId = req.params.id;
  console.log(userId, reviewId);
  const existingLike = await LikesModel.findOne({ reviewId, userId });
  console.log(existingLike, "exs like");
  if (existingLike?._id) {
    const deleted = await LikesModel.deleteOne({ _id: existingLike._id });
    res.status(201).send(deleted);
  } else {
    const newLike = await LikesModel({
      userId,
      reviewId,
    });
    const like = await newLike.save();
    res.status(201).send({ like });
  }
};
// export const handleLike = async (req, res) => {
//   const userId = req.user.id;
//   const reviewId = req.params.id;

//   const existingLike = await LikesModel.findOne({ reviewId, userId });

//   if (existingLike?._id) {
//     await LikesModel.deleteOne({ _id: existingLike._id });
//     res.status(201).send({ message: "Like removed" });
//   } else {
//     const newLike = await LikesModel({
//       userId,
//       reviewId,
//     });

//     await newLike.save();
//     res.status(201).send({ message: "Like added" });
//   }
// };
// export const handleLike = async (req, res) => {
//   const userId = req.user.id;
//   const reviewId = req.params.id;
//   console.log(userId, "userId", reviewId, "reviewId");

//   if (!userId || !reviewId) {
//     return res.status(400).send({ message: "Invalid user or review ID" });
//   }

//   const existingLike = await LikesModel.findOne({ reviewId, userId });

//   if (existingLike?._id) {
//     await LikesModel.deleteOne({ _id: existingLike._id });
//     return res.status(201).send({ message: "Like removed" });
//   } else {
//     const newLike = await LikesModel({
//       userId,
//       reviewId,
//     });

//     await newLike.save();
//     return res.status(201).send({ message: "Like added" });
//   }
// };
export const likesCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;
    const likes = await LikesModel.find({ reviewId: reviewId });
    if (!likes) {
      return res.status(304).json({ message: "likes is empty" });
    }
    const length = likes.length;
    res.status(200).send({ likes, length });
  } catch (error) {
    res.status(500).json({ message: "Error in likesCount" });
  }
};
// export const AllLikes = async (req, res) => {
//   try {
//     const allLikes = await LikesModel.find();
//     if (!allLikes) {
//       return res.status(304).json({ message: "likes is empty" });
//     }
//     res.status(200).send({ AllLikes });
//   } catch (error) {
//     res.status(500).json({ message: "Error in AllLikes" });
//   }
// };
