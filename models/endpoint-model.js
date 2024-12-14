const db = require("../db/connection");
const fs = require("fs/promises");

function fetchEndpoints() {
  return fs.readFile("endpoints.json", "utf-8").then((data) => {
    const parsedData = JSON.parse(data);
    return parsedData;
  });
}

module.exports = { fetchEndpoints };
