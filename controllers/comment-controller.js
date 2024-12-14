const { removeComment } = require("../models/comment-model");

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
}

module.exports = { deleteCommentById };
