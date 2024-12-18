const { getUserByUsername } = require("../controllers/user-controller");
const db = require("../db/connection");

function fetchUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

function fetchUserByUsername(username) {
  if (username.length <= 3) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return rows[0];
    });
}

module.exports = { fetchUsers, fetchUserByUsername };
