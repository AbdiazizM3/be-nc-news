const db = require("../db/connection");
const format = require("pg-format");

function fetchArticleById(id) {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count 
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return rows[0];
      }
    });
}

function fetchArticles(topic, sortBy, orderIn) {
  const allowedSorts = [
    "title",
    "author",
    "topic",
    "created_at",
    "votes",
    "comment_count",
    "body",
  ];

  const allowedOrder = ["ASC", "DESC"];

  if (!allowedSorts.includes(sortBy) || !allowedOrder.includes(orderIn)) {
    sortBy = "created_at";
    orderIn = "DESC";
  }

  const queryValues = [];

  let qString = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count
  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryValues.push(topic);
    qString += " WHERE topic = $1";
  }

  qString += `
       GROUP BY articles.article_id 
       ORDER BY ${sortBy} ${orderIn}`;

  return db.query(qString, queryValues).then(({ rows }) => {
    return rows;
  });
}

function changeArticleById(id, body) {
  const { inc_votes } = body;
  if (typeof inc_votes !== "number" || !inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  return db
    .query(
      `
    UPDATE articles SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function fetchCommentById(id) {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at`, [
      id,
    ])
    .then(({ rows }) => {
      return rows;
    });
}

function createComment(newPost, id) {
  const { username, body } = newPost;

  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  const insertItemStr = format(
    `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    (%L)
    RETURNING *
    `,
    [username, body, id]
  );
  return db.query(insertItemStr).then(({ rows }) => {
    return rows[0];
  });
}

async function checkIfArticleExists(article) {
  const isArticleReal = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article]
  );

  if (isArticleReal.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }
}

async function checkIfUsernameExists(body) {
  const { username } = body;
  const isUsernameReal = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  if (isUsernameReal.rows.length === 0) {
    return Promise.reject({ status: 400, msg: "User does not exist" });
  }
}

function createArticle(newPost) {
  const { username, title, body, topic } = newPost;

  if (
    typeof username !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  const insertItemStr = format(
    `
    INSERT INTO articles
    (author, title, body, topic)
    VALUES
    (%L)
    RETURNING *
    `,
    [username, title, body, topic]
  );

  return db.query(insertItemStr).then(({ rows }) => {
    const article_id = rows[0].article_id;

    return db
      .query(
        `
      SELECT articles.*, COUNT(comments.comment_id) AS comment_count 
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 GROUP BY articles.article_id
      `,
        [article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
}

module.exports = {
  fetchArticleById,
  fetchArticles,
  changeArticleById,
  checkIfArticleExists,
  fetchCommentById,
  createComment,
  checkIfUsernameExists,
  createArticle,
};
