import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: "file_" + Date.now(),
      bucketName: "photos",
    };
  },
});
const upload = multer({ storage: storage });
export default upload;
