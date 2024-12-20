const {
  fetchArticleById,
  fetchArticles,
  changeArticleById,
  checkIfArticleExists,
  fetchCommentById,
  createComment,
  checkIfUsernameExists,
  createArticle,
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
  const { topic, sort, order } = req.query;
  fetchArticles(topic, sort, order)
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
  checkIfArticleExists(article_id)
    .then(() => {
      checkIfUsernameExists(req.body)
        .then(() => {
          createComment(req.body, article_id)
            .then((comment) => {
              res.status(201).send({ comment });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
}

function updateArticleById(req, res, next) {
  const { article_id } = req.params;
  checkIfArticleExists(article_id)
    .then(() => {
      changeArticleById(article_id, req.body)
        .then((article) => {
          res.status(201).send({ article });
        })
        .catch(next);
    })
    .catch(next);
}

function addArticle(req, res, next) {
  checkIfUsernameExists(req.body)
    .then(() => {
      createArticle(req.body)
        .then((article) => {
          res.status(201).send({ article });
        })
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  getAtricleById,
  getArticles,
  getCommentById,
  addComment,
  updateArticleById,
  addArticle,
};
