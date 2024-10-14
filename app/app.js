const express = require("express");
const app = express();
const { getTopics } = require("./controller");

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
