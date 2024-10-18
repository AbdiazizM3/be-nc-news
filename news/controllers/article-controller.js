const {
  fetchArticleById,
  fetchArticles,
  changeArticleById,
  checkIfArticleExists,
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

module.exports = {
  getAtricleById,
  getArticles,
  updateArticleById,
};
