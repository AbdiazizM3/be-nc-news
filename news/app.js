const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controller");
const { getEndpoints } = require("./controllers/endpoint-controller");
const {
  getAtricleById,
  getArticles,
} = require("./controllers/article-controller");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getAtricleById);

app.get("/api/articles", getArticles);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
