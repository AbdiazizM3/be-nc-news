const request = require("supertest");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
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
          expect(body.topics.length).toBe(3);
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
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.author).toBe("icellusedkars");
          expect(body.article.title).toBe(
            "Eight pug gifs that remind me of mitch"
          );
          expect(body.article.article_id).toBe(3);
          expect(body.article.body).toBe("some gifs");
          expect(body.article.topic).toBe("mitch");
          expect(typeof body.article.created_at).toBe("string");
          expect(body.article.votes).toBe(0);
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
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
          expect(body.articles.length).toBe(11);
          for (let i = 0; i < 10; i++) {
            expect(typeof body.articles[i].article_id).toBe("number");
            expect(typeof body.articles[i].author).toBe("string");
            expect(typeof body.articles[i].title).toBe("string");
            expect(typeof body.articles[i].topic).toBe("string");
            expect(typeof body.articles[i].created_at).toBe("string");
            expect(typeof body.articles[i].votes).toBe("number");
            expect(typeof body.articles[i].comment_count).toBe("string");
          }
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
          expect(body.comments.length).toBe(10);
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
  describe("CORE: GET /api/users", () => {
    test("29) 200: Responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
        });
    });
    test("30) 200: Response contains the properties of username, name, and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(4);
          body.users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
  });
  describe("GET /api/articles (sorting queries)", () => {
    test("31) 200: Response will sort articles by any valid column in either ascending or descending order", () => {
      return request(app)
        .get("/api/articles?sort=author&&order=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author");
        });
    });
    test("32) 200: Response will sort articles by created_at in descending order by default when no query is passed or an invalid query is passed", () => {
      return request(app)
        .get("/api/articles?invalid_queryr=ABC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET /api/articles (topic query)", () => {
    test("33) 200: Response will filters articles by the specified topic value", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(11);
          for (let i = 0; i < 10; i++) {
            expect(body.articles[i].topic).toBe("mitch");
          }
        });
    });
  });
  describe("GET /api/articles/:article_id (comment_count)", () => {
    test("34) 200: Article response object includes comment_count", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe("2");
        });
    });
    test("35) 200: Returns an article with 0 comments", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe("0");
        });
    });
  });
});

describe("ADVANCED", () => {
  describe("GET /api/users/:username", () => {
    test("36) 200: Responds with a user object by its username", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.user).toBe("object");
          expect(body.user.username).toBe("butter_bridge");
          expect(body.user.name).toBe("jonny");
          expect(body.user.avatar_url).toBe(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
        });
    });
    test("37) 400: Responds with an appropriate error when provided an invalid username", () => {
      return request(app)
        .get("/api/users/baa")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("38) 404: Responds with an appropriate error when provided with a valid username that does not exist", () => {
      return request(app)
        .get("/api/users/not_a_user")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User not found");
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    test("39) 200: Responds with the updated comment object", () => {
      const update = { inc_votes: -2 };
      return request(app)
        .patch("/api/comments/1")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.comment).toBe("object");
          expect(body.comment.body).toBe(
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          );
          expect(body.comment.votes).toBe(14);
          expect(body.comment.author).toBe("butter_bridge");
          expect(body.comment.article_id).toBe(9);
          expect(typeof body.comment.created_at).toBe("string");
        });
    });
    test("40) 400: Responds with an appropriate error when passed a request with valid fields that have invalid inputs", () => {
      const update = { inc_votes: "Hi" };
      return request(app)
        .patch("/api/comments/1")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("41) 400: Responds with an appropriate error when request is passed with invalid fields", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("42) 400: Responds with an appropriate error when passed with an invalid id", () => {
      const update = { inc_votes: -2 };
      return request(app)
        .patch("/api/comments/not_a_valid_id")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("43) 404: Responds with an appropriate error when passed a valid id that doesn't exist", () => {
      const update = { inc_votes: -2 };
      return request(app)
        .patch("/api/comments/999999")
        .send(update)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });
  describe("POST /api/articles", () => {
    test("44) 201: Responds with the posted article", () => {
      const newItem = {
        username: "icellusedkars",
        title: "Kitties",
        body: "The most adorable creatures on earth.",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newItem)
        .expect(201)
        .then(({ body }) => {
          expect(body.article.author).toBe("icellusedkars");
          expect(body.article.title).toBe("Kitties");
          expect(body.article.body).toBe(
            "The most adorable creatures on earth."
          );
          expect(body.article.topic).toBe("cats");
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
          );
          expect(body.article.article_id).toBe(14);
          expect(body.article.votes).toBe(0);
          expect(typeof body.article.created_at).toBe("string");
          expect(body.article.comment_count).toBe("0");
        });
    });
    test("45) 400: Responds with appropriate errors when request has an invalid username", () => {
      const newItem = {
        username: "not_a_user",
        title: "Kitties",
        body: "The most adorable creatures on earth.",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("User does not exist");
        });
    });
    test("46) 400: Responds with appropriate errors if request has invalid fields", () => {
      return request(app)
        .post("/api/articles")
        .send({ username: "icellusedkars" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("47) 400: Responds with appropriate errors if request has valid fields with incorrect data types", () => {
      const newItem = {
        username: "icellusedkars",
        title: 8,
        body: "The most adorable creatures on earth.",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
  describe("GET /api/articles (pagination)", () => {
    test("48) 200: Responds with an array of articles to the length of the limit query", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(6);
        });
    });
    test("49) 200: Responds with a default limit of 10 articles when no limit is provided", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(11);
        });
    });
    test("50) 200: Responds with the total count regardless of the limit or filter", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles[body.articles.length - 1].total_count).toBe(13);
        });
    });
    test("51) 200: Responds with the next set of articles on page 2 when query is p=2", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(4);
        });
    });
    test("52) 200: Responds with the default limit or p when input is invalid", () => {
      return request(app)
        .get("/api/articles?limit=not_a_number&&p=not_a_number")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(11);
          expect(body.articles[0].article_id).toBe(3);
          expect(body.articles[0].author).toBe("icellusedkars");
          expect(body.articles[0].title).toBe(
            "Eight pug gifs that remind me of mitch"
          );
          expect(body.articles[0].topic).toBe("mitch");
          expect(typeof body.articles[0].created_at).toBe("string");
          expect(body.articles[0].votes).toBe(0);
          expect(typeof body.articles[0].comment_count).toBe("string");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments (pagination)", () => {
    test("53) 200: Responds with an array of comments to the length of the limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=3")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBe(3);
        });
    });
    test("54) 200: Responds with a default of 10 comments when no limit is provided", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBe(10);
        });
    });
    test("55) 200: Responds with the default 10 comment cap when invalid query is passed", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=not_a_number")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBe(10);
        });
    });
    test("56) 200: Responds with an array of the first 10 comments when p = 1", () => {
      return request(app)
        .get("/api/articles/1/comments?p=1")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBe(10);
        });
    });
    test("57) 200: Responds with a default of the first 10 comments when no query is provided", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBe(10);
        });
    });
    test("58) 200: Responds with the next page of comments when p = 2", () => {
      return request(app)
        .get("/api/articles/1/comments?p=2")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBe(1);
        });
    });
    test("59) 200: Responds with the default first §0 comments when query input is invalid", () => {
      return request(app)
        .get("/api/articles/1/comments?p=not_a_number")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBe(10);
        });
    });
  });
  describe("POST /api/topics", () => {
    test("60) 201: Responds with a topic object containing the newly added topic", () => {
      const newItem = {
        new_slug: "dogs",
        new_description: "Not cats",
      };
      return request(app)
        .post("/api/topics")
        .send(newItem)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic.slug).toBe("dogs");
          expect(body.topic.description).toBe("Not cats");
        });
    });
    test("61) 400: Responds with appropriate errors when request body has invalid inputs", () => {
      return request(app)
        .post("/api/topics")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("62) 400: Responds with appropriate errors when request body has valid inputs with invalid types", () => {
      const newItem = {
        new_slug: 4,
        new_description: "Not cats",
      };
      return request(app)
        .post("/api/topics")
        .send(newItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});
