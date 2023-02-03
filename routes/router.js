import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post-controller.js";
import {
  deleteUser,
  getUser,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/user-controller.js";
const route = express.Router();

route.get("/", (req, res) => {
  res.send("hello world");
});
//USER-ROUTES
route.post("/user/register", registerUser);
route.post("/user/login", loginUser);
route.put("/user/update/:id", updateUser);
route.delete("/user/delete/:id", deleteUser);
route.get("/user/get/:id", getUser);
//POST-ROUTES
route.post("/post/create", createPost);
route.delete("/post/delete/:id", deletePost);
route.put("/post/update/:id", updatePost);
route.get("/post/get/:id", getPost);
route.get("/post", getPosts);

export default route;
