const express = require("express");

const {
  deleteCommentById,
  updateCommentById,
} = require("../controllers/comment-controller");

const commentRouter = express.Router();

commentRouter.delete("/:comment_id", deleteCommentById);
commentRouter.patch("/:comment_id", updateCommentById);

module.exports = commentRouter;
