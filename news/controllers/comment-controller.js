const {
  fetchCommentById,
  checkIfArticleExists,
  createComment,
  removeComment,
  checkIfCommentExists,
  checkIfUsernameExists,
} = require("../models/comment-model");

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

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  checkIfCommentExists(comment_id)
    .then(() => {
      removeComment(comment_id).then(() => {
        res.status(204).send({});
      });
    })
    .catch(next);
}

module.exports = { getCommentById, addComment, deleteCommentById };
