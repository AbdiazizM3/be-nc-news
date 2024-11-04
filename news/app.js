const cors = require("cors");
const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controller");
const { getEndpoints } = require("./controllers/endpoint-controller");
const {
  getAtricleById,
  getArticles,
  updateArticleById,
} = require("./controllers/article-controller");
const {
  getCommentById,
  addComment,
  deleteCommentById,
} = require("./controllers/comment-controller");
const { getUsers } = require("./controllers/user-controller");

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getAtricleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentById);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", updateArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
