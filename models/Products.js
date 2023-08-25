import mongoose from "mongoose";
const ProductsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    group: {
      type: String,
      enum: ['books', 'games', 'movies', 'music'],
      required: true,
    },
    author: { type: String, required: true },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReviewsModel",
      },
    ],

    //   averageRating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);
// Метод для обновления среднего рейтинга

// ProductSchema.methods.updateAverageRating = async function () {
//   const reviews = await mongoose.model("Review").find({ productId: this._id });
//   if (reviews.length === 0) {
//     this.averageRating = 0;
//   } else {
//     const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//     this.averageRating = totalRating / reviews.length;
//   }
//   await this.save();
// };
export default mongoose.model("ProductsModel", ProductsSchema);
