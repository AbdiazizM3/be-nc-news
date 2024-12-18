const cors = require("cors");
const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/endpoint-controller");

const articleRouter = require("./routes/article.router");
const topicRouter = require("./routes/topic.router");
const commentRouter = require("./routes/comment.router");
const userRouter = require("./routes/user.router");

app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);
app.use("/api/articles", articleRouter);
app.use("/api/topics", topicRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users", userRouter);

app.use((err, req, res, next) => {
  if (err.code) {
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
