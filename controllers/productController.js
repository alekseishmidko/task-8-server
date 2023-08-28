import ProductsModel from "../models/Products.js";

// * @route POST /api/posts/create
// * @desс  создание произведения
// * @access auth
// */
export const createProduct = async (req, res) => {
  try {
    const { title, group } = req.body;

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
    const allProds = await ProductsModel.find()
      .sort("createdAt")
      .populate("author")
      .populate("ratings")
      .exec();
    if (!allProds) {
      return res.json({ message: "there arent products" });
    }
    res.json(allProds);
  } catch (error) {
    res.status(500).json({ message: "Error in getAll prod" });
  }
};
