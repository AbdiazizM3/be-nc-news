const express = require("express");

const {
  getAtricleById,
  getArticles,
  updateArticleById,
  getCommentById,
  addComment,
} = require("../controllers/article-controller");

const articleRouter = express.Router();

articleRouter.get("/:article_id", getAtricleById);
articleRouter.get("/", getArticles);
articleRouter.get("/:article_id/comments", getCommentById);
articleRouter.post("/:article_id/comments", addComment);
articleRouter.patch("/:article_id", updateArticleById);

module.exports = articleRouter;
