const express = require("express");

const {
  getAtricleById,
  getArticles,
  updateArticleById,
  getCommentById,
  addComment,
  addArticle,
  deleteArticleById,
} = require("../controllers/article-controller");

const articleRouter = express.Router();

articleRouter.get("/:article_id", getAtricleById);
articleRouter.get("/", getArticles);
articleRouter.get("/:article_id/comments", getCommentById);
articleRouter.post("/:article_id/comments", addComment);
articleRouter.patch("/:article_id", updateArticleById);
articleRouter.post("/", addArticle);
articleRouter.delete("/:article_id", deleteArticleById);

module.exports = articleRouter;
