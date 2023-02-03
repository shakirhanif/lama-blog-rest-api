import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connection = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URI, () => {
      console.log("database connected successfully");
    });
  } catch (error) {
    console.log("connection to mongodb failed", error.message);
  }
};
export default connection;
