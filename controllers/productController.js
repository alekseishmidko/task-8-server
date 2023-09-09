import ProductsModel from "../models/Products.js";
import RatingsModel from "../models/Rating.js";

const calcAverageRatingFive = (arr) => {
  if (!arr || arr.length === 0) {
    return 0;
  }

  const totalRating = arr.reduce((sum, item) => sum + item.ratingFive, 0);
  const averageRating = totalRating / arr.length;

  return averageRating;
};
// * @route POST /api/posts/create
// * @desс  создание произведения
// * @access auth
// */
export const createProduct = async (req, res) => {
  try {
    console.log("createProduct", req.uploadedImageUrls);
    const { title, group, images } = req.body;

    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorised" });
    }
    const existingProduct = await ProductsModel.findOne({ title, group });
    if (existingProduct) {
      return res.status(400).json({
        message: "Product with this title and/or group is exist!",
      });
    }
    const newProduct = await ProductsModel({
      title,
      group,
      author: userId,
      images,
    });
    const product = await newProduct.save();
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Error in createProduct" });
  }
};
// * @route GET /api/posts/all
// * @desс  получение всех
// * @access auth
// */
export const getAllProducts = async (req, res) => {
  try {
    // populate  - вписывает нужное поле из другой модели например автора , а я в свою очередь вписал только userId

    const sortBy = req.query.sortBy;
    // console.log(sortBy);
    const parameters = sortBy === "" ? null : { group: sortBy };
    // console.log(parameters);
    //
    const allProducts = await ProductsModel.find(parameters)
      .sort("createdAt")
      .populate("author")
      .populate("ratingFive")
      .exec();

    if (!allProducts) {
      return res.json({ message: "there arent products" });
    }
    //
    const productsWithAvgRatingFive = await Promise.all(
      allProducts.map(async (review) => {
        const avgRatingFive =
          review.ratingFive.reduce(
            (sum, rating) => sum + rating.ratingFive,
            0
          ) / review.ratingFive.length;
        return { ...review.toObject(), avgRatingFive };
      })
    );
    const productsRatings = await RatingsModel.find({
      productId: { $exists: true },
    }).exec();
    res.status(200).send({ productsWithAvgRatingFive, productsRatings });
  } catch (error) {
    res.status(500).json({ message: "Error in getAll prod" });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const product = await ProductsModel.findById(req.params.id).populate(
      "ratingFive"
    );
    const ratingFive = product.ratingFive;
    const averageRatingFive = calcAverageRatingFive(ratingFive);
    res.send({ product, averageRatingFive });
  } catch (error) {
    res.status(500).json({ message: "Error in getOneProduct" });
  }
};
