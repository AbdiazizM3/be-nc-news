const { fetchTopics } = require("../models/topic-model");

function getTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
}

module.exports = { getTopics };
