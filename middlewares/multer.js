import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();
const storageGrid = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: "photo_" + Date.now() + "_" + file.originalname,
      bucketName: "photos",
    };
  },
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body?.name || `photo_${Date.now()}.jpg`);
  },
});
const upload = multer({ storage: storage });
export default upload;
