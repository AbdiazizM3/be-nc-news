const { response } = require("./app");
const { fetchTopics } = require("./model");

function getTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
}

module.exports = { getTopics };
