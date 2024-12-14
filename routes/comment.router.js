const express = require("express");

const { deleteCommentById } = require("../controllers/comment-controller");

const commentRouter = express.Router();

commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;
