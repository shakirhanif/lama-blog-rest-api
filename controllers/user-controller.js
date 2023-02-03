import User from "../models/User.js";
import Post from "../models/Post.js";

import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const user = req.body;
    user.password = await bcrypt.hash(req.body.password, 5);
    const newUser = new User(user);
    await newUser.save();
    res.status(200).json(newUser);
    return;
  } catch (error) {
    res.status(500).json(error.message);
    return;
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("wrong credentials");
    } else if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      !match && res.status(400).json("wrong password");
      if (match) {
        const { password, ...others } = user._doc;
        res.status(200).json(others);
      }
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 5);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(401).json("you can update only your account");
  }
};

export const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User Deleted successfully");
      } catch (error) {
        res.status(500).json("no user found");
      }
    } catch (error) {
      res.status(404).json(error.message);
    }
  } else {
    res.status(401).json("you can update only your account");
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...otherData } = user._doc;
    res.status(200).json(otherData);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
