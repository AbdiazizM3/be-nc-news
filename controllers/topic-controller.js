const { fetchTopics, createTopic } = require("../models/topic-model");

function getTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function addTopic(req, res, next) {
  createTopic(req.body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
}

module.exports = { getTopics, addTopic };
