const db = require("../db/connection");

function removeComment(id) {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
}

function changeCommentById(id, body) {
  const { inc_votes } = body;
  return db
    .query(
      `
    UPDATE comments SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
    `,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
}

module.exports = { removeComment, changeCommentById };
