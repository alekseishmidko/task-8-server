import ReviewsModel from "../models/Reviews.js";
import UsersModel from "../models/Users.js";
function extractHashtags(inputString) {
  // const words = inputString.split(/\s+/); // Разбиваем строку на слова
  // const hashtags = [];

  // words.forEach((word) => {
  //   if (word.startsWith("#")) {
  //     hashtags.push(word.substring()); // Удаляем символ #
  //   }
  // });

  // return hashtags;
  const words = inputString.split(/\s+/); // Разбиваем строку на слова
  const hashtags = new Set(); // Используем Set для уникальных значений

  words.forEach((word) => {
    if (word.startsWith("#")) {
      const hashtag = word.substring(); // Удаляем символ #
      hashtags.add(hashtag);
    }
  });

  return Array.from(hashtags);
}
const calcAverageRatingFive = (arr) => {
  if (!arr || arr.length === 0) {
    return 0;
  }

  const totalRating = arr.reduce((sum, item) => sum + item.ratingFive, 0);
  const averageRating = totalRating / arr.length;

  return averageRating;
};
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
      .populate("ratingFive")
      .exec();
    if (!allReviews) {
      return res.json({ message: "there arent reviews" });
    }
    const last6ReviewsRaw = await ReviewsModel.find()
      .limit(6)
      .populate("userId")
      .populate("ratingFive")
      .sort("-createdAt")
      .exec();
    const pop6ReviewsRaw = await ReviewsModel.find()
      .limit(6)
      .populate("userId")
      .populate("ratingFive")
      .sort("rating")
      .exec();
    const allUnicTags = [
      ...new Set(allReviews.flatMap((review) => review.tags)),
    ];
    const reviewsWithAvgRatingFive = await Promise.all(
      allReviews.map(async (review) => {
        const avgRatingFive =
          review.ratingFive.reduce(
            (sum, rating) => sum + rating.ratingFive,
            0
          ) / review.ratingFive.length;
        return { ...review.toObject(), avgRatingFive };
      })
    );
    const last6Reviews = await Promise.all(
      last6ReviewsRaw.map(async (review) => {
        const avgRatingFive =
          review.ratingFive.reduce(
            (sum, rating) => sum + rating.ratingFive,
            0
          ) / review.ratingFive.length;
        return { ...review.toObject(), avgRatingFive };
      })
    );
    const pop6Reviews = await Promise.all(
      pop6ReviewsRaw.map(async (review) => {
        const avgRatingFive =
          review.ratingFive.reduce(
            (sum, rating) => sum + rating.ratingFive,
            0
          ) / review.ratingFive.length;
        return { ...review.toObject(), avgRatingFive };
      })
    );
    // res.send({ reviewsWithAvgRatingFive });
    res.send({
      allUnicTags,
      allReviews,
      last6Reviews,
      pop6Reviews,
      reviewsWithAvgRatingFive,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in getAll reviews" });
  }
};

export const getOneReview = async (req, res) => {
  try {
    const review = await ReviewsModel.findById(req.params.id).populate(
      "ratingFive"
    );

    const ratingFive = review.ratingFive;

    const averageRatingFive = calcAverageRatingFive(ratingFive);
    res.send({ review, averageRatingFive });
  } catch (error) {
    res.status(500).json({ message: "Error in getOneReview" });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    console.log(req.body);
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
    const userReviews = await ReviewsModel.find({ userId })
      .populate("ratingFive")
      .populate("productId");
    const newData = userReviews.map((item) => {
      const ratingFive = item.ratingFive;
      if (ratingFive.length > 0) {
        const totalRating = ratingFive.reduce(
          (sum, rating) => sum + rating.ratingFive,
          0
        );
        const averageRating = (totalRating / ratingFive.length).toFixed(1);
        return { ...item, averageRatingFive: averageRating };
      } else {
        return { ...item, averageRatingFive: 0 };
      }
    });
    const arr = newData.map((item) => {
      return item._doc;
    });
    const aver = newData.map((item) => {
      return { averageRatingFive: item.averageRatingFive };
    });
    const combinedData = arr
      .map((item, index) => ({
        ...item,
        ...aver[index],
      }))
      .map((item) => ({
        ...item,
        productTitle: item.productId.title,
      }));
    res.send(combinedData);
    // res.send(userReviews);
  } catch (error) {
    res.status(500).json({ message: "Error in getMyReviews" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;
    const _id = req.params.id;
    // console.log(userId, "/", _id);
    console.log(req.body.title, req.body.content, "body");
    const { title, group, rating, content } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "not authorised" });
    }
    //
    const existingReview = await ReviewsModel.findOne({ _id });
    console.log(existingReview, "existingReview");
    if (!existingReview) {
      return res
        .status(404)
        .json({ message: "dont find review! (updateReview)" });
    }
    // console.log(existingReview);
    //  проверка на роль
    if (
      user.role === "admin" ||
      user.role === "superadmin" ||
      existingReview.userId === userId
    ) {
      existingReview.title = title;
      existingReview.tags = extractHashtags(content);

      existingReview.group = group;
      existingReview.rating = rating;
      existingReview.content = content;

      await existingReview.save();

      res.status(200).json({ message: "Review is succesfully updated" });
    } else {
      res.status(401).json({ message: "not authorised!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in updateReview" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.id;
    const _id = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: "not authorised" });
    }

    const review = await ReviewsModel.findById(_id);
    console.log(review.userId, "review", userId);

    if (!review) {
      return res.status(404).json({ message: "Review is not found" });
    }

    if (
      user.role === "admin" ||
      user.role === "superadmin" ||
      review.userId === userId
    ) {
      const deleteReview = await ReviewsModel.findByIdAndDelete(_id);
      if (!deleteReview) {
        return res.status(500).json({ message: "Failed to delete review" });
      }

      return res.status(200).json({ message: "Review successfully deleted" });
    } else {
      return res.status(403).json({ message: "Unauthorized to delete review" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in deleteReview" });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.id;
    // _id здесь это id пользователя, по которому искать все его обзоры
    const _id = req.params.id;
    if (user.role === "admin" || user.role === "superadmin") {
      const reviewsByUser = await ReviewsModel.find({ userId: _id });
      res.send(reviewsByUser);
      if (!reviewsByUser) {
        return res
          .status(500)
          .json({ message: "Failed to get reviews by user" });
      }
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized to get reviews by user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in getReviewsByUser" });
  }
};

//
// async function calculateAverageRating(reviews) {
//   const updatedReviews = await Promise.all(
//     reviews.map(async (review) => {
//       const { ratingFive, _id } = review;

//       if (ratingFive.length === 0) {
//         return { ...review, averageRatingFive: 0 };
//       }

//       const ratingSum = ratingFive.reduce(
//         (acc, rating) => acc + rating.ratingFive,
//         0
//       );
//       const averageRating = ratingSum / ratingFive.length;

//       // Обновляем поле averageRatingFive в базе данных
//       await ReviewsModel.findByIdAndUpdate(_id, {
//         averageRatingFive: averageRating,
//       });

//       return { ...review, averageRatingFive: averageRating };
//     })
//   );
//   const answ = updatedReviews.map((item) => {
//     return { rev: item._doc, averageRatingFive: item.averageRatingFive };
//   });
//   const answer2 = answ.map((item) => {
//     // Получаем рейтинг из поля ratingFive и вычисляем среднее значение
//     const ratingFive = item.rev.ratingFive;
//     const averageRating =
//       ratingFive.length > 0
//         ? ratingFive.reduce((acc, current) => acc + current.ratingFive, 0) /
//           ratingFive.length
//         : 0;
//     return item;
//   });
//   return answer2;
// }
// calculateAverageRating(userReviews)
//   .then((updatedReviews) => {
//     res.send(updatedReviews);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
