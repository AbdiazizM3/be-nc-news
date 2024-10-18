const db = require("../../db/connection");
const format = require("pg-format");

function fetchCommentById(id) {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at`, [
      id,
    ])
    .then(({ rows }) => {
      return rows;
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

function removeComment(id) {
  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    `,
    [id]
  );
}

const checkIfCommentExists = async (id) => {
  const isCommentReal = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [id]
  );

  if (isCommentReal.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
};

const checkIfUsernameExists = async (body) => {
  const { username } = body;
  const isUsernameReal = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  if (isUsernameReal.rows.length === 0) {
    return Promise.reject({ status: 400, msg: "User does not exist" });
  }
};

module.exports = {
  fetchCommentById,
  checkIfArticleExists,
  createComment,
  removeComment,
  checkIfCommentExists,
  checkIfUsernameExists,
};
