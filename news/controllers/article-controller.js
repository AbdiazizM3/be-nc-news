const {
  fetchArticleById,
  fetchArticles,
  fetchCommentById,
  checkIfArticleExists,
  createComment,
} = require("../models/article-model");

function getAtricleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getCommentById(req, res, next) {
  const { article_id } = req.params;
  checkIfArticleExists(article_id)
    .then(() => {
      fetchCommentById(article_id).then((comments) => {
        res.status(200).send({ comments });
      });
    })
    .catch(next);
}

function addComment(req, res, next) {
  const { article_id } = req.params;
  createComment(req.body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

module.exports = { getAtricleById, getArticles, getCommentById, addComment };
