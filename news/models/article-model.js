const db = require("../../db/connection");
const format = require("pg-format");

function fetchArticleById(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return rows[0];
      }
    });
}

function fetchArticles() {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
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

const checkIfArticleExists = async (article) => {
  const isArticleReal = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article]
  );

  if (isArticleReal.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }
};

module.exports = {
  fetchArticleById,
  fetchArticles,
  changeArticleById,
  checkIfArticleExists,
};
