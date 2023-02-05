import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: "photo_" + Date.now() + "_" + file.originalname,
      bucketName: "photos",
    };
  },
});
const upload = multer({ storage: storage });
export default upload;
