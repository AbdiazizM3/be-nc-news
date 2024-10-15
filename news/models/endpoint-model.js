const db = require("../../db/connection");
const fs = require("fs/promises");

function fetchEndpoints() {
  return fs.readFile("endpoints.json", "utf-8").then((data) => {
    const parsedData = JSON.parse(data);
    return JSON.stringify(parsedData, null, 2);
  });
}

module.exports = { fetchEndpoints };
