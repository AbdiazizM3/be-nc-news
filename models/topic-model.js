const db = require("../db/connection");
const format = require("pg-format");

function fetchTopics() {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
}

function createTopic(body) {
  const { new_slug, new_description } = body;

  if (typeof new_slug !== "string" || typeof new_description !== "string") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  const insertItemStr = format(
    `
    INSERT INTO topics
    (slug, description)
    VALUES
    (%L)
    RETURNING *
    `,
    [new_slug, new_description]
  );

  return db.query(insertItemStr).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { fetchTopics, createTopic };
