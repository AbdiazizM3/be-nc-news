const request = require("supertest");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../news/app");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("CORE", () => {
  describe("GET /api/topics", () => {
    test("1) 200: Respond with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
        });
    });
    test("2) 200: Response contains the properties slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
  describe("GET /api", () => {
    test("3) 200: Respond with all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints);
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("4) 200: Respond with an article object containing all properties from an article", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.article.author).toBe("string");
          expect(typeof body.article.title).toBe("string");
          expect(body.article.article_id).toBe(2);
          expect(typeof body.article.body).toBe("string");
          expect(typeof body.article.topic).toBe("string");
          expect(typeof body.article.created_at).toBe("string");
          expect(typeof body.article.votes).toBe("number");
          expect(typeof body.article.article_img_url).toBe("string");
        });
    });
    test("5) 400: Responds with an appropriate status and error message when provided with an invalid id", () => {
      return request(app)
        .get("/api/articles/not_a_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("6) 404: Responds with an appropriate status and error message when provided with a valid id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });
  describe("GET /api/articles", () => {
    test("7) 200: Responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.comment_count).toBe("string");
          });
          expect(Array.isArray(body.articles)).toBe(true);
        });
    });
    test("8) 200: Articles are sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("9) 200: No body properties are found on any of the objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            expect(article).not.toHaveProperty("body");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("10) 200: Responds with an array of comments from the given article_id with the appropriate properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.body).toBe("string");
            expect(comment.article_id).toBe(1);
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
          });
          expect(Array.isArray(body.comments)).toBe(true);
        });
    });
    test("11) 200: Should be sorted by the most recent comment first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeSortedBy("created_at");
        });
    });
    test("12) 400: Responds with an appropriate status and error message when provided with an invalid id", () => {
      return request(app)
        .get("/api/articles/not_a_valid_id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("13) 404: Responds with an appropriate status and error message when provided with a valid id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("14) 200: Return an empty object when passed an existing id with no values", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("15) 201: Responds with the posted comment", () => {
      const newItem = {
        username: "rogersop",
        body: "DEF",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newItem)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.comment_id).toBe(19);
          expect(body.comment.author).toBe("rogersop");
          expect(body.comment.body).toBe("DEF");
          expect(body.comment.article_id).toBe(2);
          expect(body.comment.votes).toBe(0);
          expect(typeof body.comment.created_at).toBe("string");
        });
    });
    test("16) 400: Responds with an appropriate status and error message when provided with incorrect fields", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("User does not exist");
        });
    });
    test("17) 400: Responds with an appropriate status and error message when provided with valid fields with incorrect values", () => {
      const newItem = {
        username: "rogersop",
        body: 13,
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("18) 400: Responds with an appropriate status and error message when provided with an invalid id", () => {
      const newItem = {
        username: "rogersop",
        body: "DEF",
      };
      return request(app)
        .post("/api/articles/not_a_valid_id/comments")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("19) 404: Responds with an appropriate status and error message when provided with a valid id that does not exist", () => {
      const newItem = {
        username: "rogersop",
        body: "DEF",
      };
      return request(app)
        .post("/api/articles/9999/comments")
        .send(newItem)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("20) 400: Responds with an appropriate status and error message when provided with correct data but username does not exist", () => {
      const newItem = {
        username: "ABC",
        body: "DEF",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("User does not exist");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("21) 201: Responds with with the updated article", () => {
      const update = { inc_votes: 2 };
      return request(app)
        .patch("/api/articles/3")
        .send(update)
        .expect(201)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(3);
          expect(body.article.title).toBe(
            "Eight pug gifs that remind me of mitch"
          );
          expect(body.article.topic).toBe("mitch");
          expect(body.article.author).toBe("icellusedkars");
          expect(body.article.body).toBe("some gifs");
          expect(typeof body.article.created_at).toBe("string");
          expect(body.article.votes).toBe(2);
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("22) 400: Responds with an appropriate status and error message when provided with a body with invalid fields", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("23) 400: Responds with an appropriate status and error message when provided with a body with valid fields with invalid values", () => {
      const update = { inc_votes: "Hi" };
      return request(app)
        .patch("/api/articles/3")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("24) 400: Responds with an appropriate status and error message when provided with an invalid id", () => {
      const update = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/not_a_valid_id")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("25) 404: Responds with an appropriate status and error message when provided with a valid id that does not exist", () => {
      const update = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/99999")
        .send(update)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("26) 204: Responds with no content", () => {
      return request(app).delete("/api/comments/4").expect(204);
    });
    test("27) 404: Responds with an appropriate status and error message when provided with a valid id that does not exist", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("28) 400: Responds with an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .delete("/api/comments/not_a_valid_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});
