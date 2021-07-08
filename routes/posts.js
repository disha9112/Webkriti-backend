const express = require("express");
const {
  createPost,
  uploadImage,
  getPosts,
  updatePosts,
  deletePosts,
  getAllPosts,
} = require("../controllers/posts");
const { verifyToken } = require("../middlewares/authMiddleware");
const { postIdParam } = require("../middlewares/postsMiddleware");
const router = express.Router();

router.param("postId", postIdParam);

router.post("/create", verifyToken, createPost);

router.get("/getposts", verifyToken, getPosts);

router.put("/update/:postId", verifyToken, updatePosts);

router.delete("/delete/:postId", verifyToken, deletePosts);

router.get("/getallposts", getAllPosts);

router.post("/likes", verifyToken, likesCount);

module.exports = router;

// localhost:8000/posts/create
//localhost:8000/posts/uploadimage
// localhost:8000/posts/update/:postId
// localhost:8000/posts/delete/:postId
// localhost:8000/posts/getposts
// localhost:8000/posts/getallposts
