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
});
