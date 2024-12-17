const { removeComment, changeCommentById } = require("../models/comment-model");

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
}

function updateCommentById(req, res, next) {
  const { comment_id } = req.params;
  changeCommentById(comment_id, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
}

module.exports = { deleteCommentById, updateCommentById };
