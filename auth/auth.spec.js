const request = require("supertest");

const server = require("../api/server.js");
const db = require("../database/dbConfig.js");
const Users = require("../users/users-model.js");

describe("users", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("POST /api/auth/register", () => {
    it("returns status 201", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "check", password: "mate" })
        .then(res => {
          expect(res.status).toBe(201);
        });
    });

    it("returns me king as a new user with id 1", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "me", password: "king" })
        .then(res => {
          expect(res.body.username).toBe("black");
          expect(res.body.id).toBe(1);
        });
    });
  });

  describe("POST /api/auth/login", () => {
    it("returns status 201", async () => {
      // registers and confirms new user exists
      let newUser = await request(server)
        .post("/api/auth/register")
        .send({ username: "check", password: "mate" });

      expect(newUser.status).toBe(201);

      // logs in user and confirms successful login
      let loggedIn = await request(server)
        .post("/api/auth/login")
        .send({ username: "check", password: "mate" });

      expect(loggedIn.status).toBe(200);
    });

    it("returns token for logged in user", async () => {
      // registers and confirms new user exists
      let newUser = await request(server)
        .post("/api/auth/register")
        .send({ username: "check", password: "mate" });

      expect(newUser.status).toBe(201);

      // logs in user and confirms successful login
      let loggedIn = await request(server)
        .post("/api/auth/login")
        .send({ username: "check", password: "mate" });

      expect(loggedIn.status).toBe(200);
      expect(loggedIn.body.token).toBeTruthy();
    });
  });
});