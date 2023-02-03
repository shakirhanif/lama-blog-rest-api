import Post from "../models/Post.js";
export const createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error.message);
      }
    } else {
      res.status(401).json("you can only update your own post");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("post deleted successfully");
      } catch (error) {
        res.status(500).json(error.message);
      }
    } else {
      res.status(401).json("you can only delete your own post");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getPosts = async (req, res) => {
  const { username, cat } = req.query;
  try {
    let posts;
    if (cat && username) {
      posts = await Post.find({
        categories: { $in: [cat] },
        username: username,
      });
    } else if (cat) {
      posts = await Post.find({ categories: { $in: [cat] } });
    } else if (username) {
      posts = await Post.find({ username: username });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
