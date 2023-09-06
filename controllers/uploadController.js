import cloudinary from "../utils/cloudinary.js";
import upload from "../middleware/multer.js";
export const uploadImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadedImageUrls = [];

  for (const file of req.files) {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Error uploading image" });
        }
        uploadedImageUrls.push(result.secure_url);

        if (uploadedImageUrls.length === req.files.length) {
          req.uploadedImageUrls = uploadedImageUrls;
          res.send(uploadedImageUrls);
          // next();
        }
      })
      .end(file.buffer);
  }
};
