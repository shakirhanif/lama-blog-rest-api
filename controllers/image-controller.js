import mongoose from "mongoose";
import Grid from "gridfs-stream";
import dotenv from "dotenv";
dotenv.config();

var conn = mongoose.createConnection(process.env.MONGODB_URI);
let gfs, gridfsBucket;
conn.once("open", function () {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

export const getAllImages = async (req, res) => {
  try {
    const files = await gfs.files.find().toArray();
    if (!files || files.length === 0) {
      res.status(404).json("no files found");
    } else {
      res.status(200).json(files);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const getImage = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      res.status(404).json("no file exists");
    } else if (file.contentType === "image/jpeg") {
      const readStream = gridfsBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      res.status(404).json("type of file is incompatible");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const uploadImage = async (req, res) => {
  if (!req.file) {
    res.status(404).json("no file attached");
  } else {
    res.status(200).json(req.file.filename);
  }
};
