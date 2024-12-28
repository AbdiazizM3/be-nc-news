const express = require("express");

const { getTopics, addTopic } = require("../controllers/topic-controller");

const topicRouter = express.Router();

topicRouter.get("/", getTopics);
topicRouter.post("/", addTopic);

module.exports = topicRouter;
