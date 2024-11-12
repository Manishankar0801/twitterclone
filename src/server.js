/* eslint-disable */
const bodyParser = require("body-parser");
const express = require("express");

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [
  { title: "React", content: "we have done 2 projects" },
  { title: "Node", content: "we have done 1 projects" },
];

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

const getAllPosts = (req, res) => {
  return res.status(200).json(posts);
};

const getPostById = (req, res) => {
  let { id } = req.params;
  const post = posts[id];
  return res.status(200).json(post);
};

const validateData = (req, res, next) => {
  console.log("Request body:", req.body); // Log request body
  const { title, content } = req.body;
  if (!title || title.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "Please send valid title for post" });
  }
  if (!content || content.length === 0) {
    // Fix to content.length here as well
    return res
      .status(400)
      .json({ success: false, error: "Please send valid contents for post" });
  }
  req.post = { title, content };
  next();
};
const createPost = (req, res) => {
  const { post } = req;
  posts.push(post);
  return res.status(202).json({ success: true, postId: posts.length - 1 });
};

const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const postToEdit = posts[id];
  postToEdit.content = content;
  postToEdit.title = title;
  return res.status(202).json({ success: true, postToEdit: postToEdit });
};

const deletePost = (req, res) => {
  const { id } = req.params;
  posts = posts.filter((post, idx) => idx !== parseInt(id)); // Convert id to integer for comparison
  return res.status(200).json({success: true});
};

server.get("/post", getAllPosts);
server.get("/post/:id", getPostById);

server.post("/post", validateData, createPost);
server.put("/post/:id", updatePost);
server.delete("/post/:id", deletePost);

server.get("/", (req, res) => {
  return res.status(200).json("posts");
});

module.exports = { posts, server };
