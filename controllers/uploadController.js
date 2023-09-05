import cloudinary from "../utils/cloudinary.js";
import upload from "../middleware/multer.js";
export const uploadImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadedImageUrls = [];

  // Загрузка каждого изображения на Cloudinary
  for (const file of req.files) {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Error uploading image" });
        }
        // Добавить URL загруженного изображения в массив
        uploadedImageUrls.push(result.secure_url);

        // Если все изображения загружены, вернуть массив URL
        if (uploadedImageUrls.length === req.files.length) {
          // res.status(200).json({ imageUrls: uploadedImageUrls });
          req.uploadedImageUrls = uploadedImageUrls; // Добавляем массив URL в объект req
          next(); // Переходим к следующей middleware
        }
      })
      .end(file.buffer);
    // next();
  }
};
// export const uploadImages = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   // Отправка изображения на Cloudinary
//   cloudinary.uploader
//     .upload_stream({ resource_type: "auto" }, (error, result) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Error uploading image" });
//       }

//       // Вернуть URL загруженного изображения
//       res.status(200).json({ imageUrl: result.secure_url });
//     })
//     .end(req.file.buffer);
// };
