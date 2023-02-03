import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const newCat = new Category(req.body);
    await newCat.save();
    res.status(200).json(newCat);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
