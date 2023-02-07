import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category-controller.js";
import {
  getAllImages,
  getImage,
  uploadImage,
} from "../controllers/image-controller.js";
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
import upload from "../middlewares/multer.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
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
//CATEGORIES-ROUTES
route.post("/category/create", createCategory);
route.get("/category/get", getCategories);
//UPLOAD-IMAGES
route.post("/upload/image", upload.single("file"), uploadImage);
route.get("/files", getAllImages);
route.get("/files/:filename", getImage);
//JWT-TEST

export const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(403).json("invalid token");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json("not authenticated");
  }
};
const generateAccessToken = (user) => {
  return jwt.sign(
    { username: user.username, userId: user._id },
    "mySecretKey",
    { expiresIn: "5s" }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { username: user.username, userId: user._id },
    "myRefreshSecretKey"
  );
};

let refreshTokens = [];
const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("wrong credentials");
    } else if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      !match && res.status(400).json("wrong password");
      if (match) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        const { password, ...others } = user._doc;
        res.status(200).json({ user: others, accessToken, refreshToken });
        // res.status(200).json(others);
      }
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};
route.post("/user/signin", signInUser);

route.delete("/somepost/:id", verify, (req, res) => {
  if (req.user.username === req.body.username) {
    res.status(200).json("yes you deleted it");
  } else {
    res.status(401).json("not authorized");
  }
});
route.post("/api/refresh", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json("you are not authenticated!");
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("refresh token is not valid");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    if (err) {
      console.log(err.message);
    } else {
      refreshTokens = refreshTokens.filter((x) => {
        return x !== refreshToken;
      });
      const newRefreshToken = generateRefreshToken(user);
      const newAccessToken = generateAccessToken(user);
      refreshTokens.push(newRefreshToken);
      res
        .status(200)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
  });
});
route.post("/api/logout", verify, (req, res) => {
  if (req.user) {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((x) => {
      return x !== refreshToken;
    });
    res.status(200).json("loged out successfully");
  } else {
    res.status(401).json("you are not authenticated");
  }
});

export default route;
