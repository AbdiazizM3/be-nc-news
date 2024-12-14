const express = require("express");

const { getTopics } = require("../controllers/topic-controller");

const topicRouter = express.Router();

topicRouter.get("/", getTopics);

module.exports = topicRouter;
