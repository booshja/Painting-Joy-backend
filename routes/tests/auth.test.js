const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Admin = require("../../models/admin");

beforeAll(async () => {
    await db.query("DELETE FROM admins");

    const testAdmin = await Admin.register({
        username: "testadmin",
        password: "adminpassword",
        firstName: "Ralph",
        email: "ralph@email.com",
        secretQuestion: "What is the answer?",
        secretAnswer: "Pizza",
    });
});

beforeEach(async () => {
    await db.query("BEGIN");
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

afterAll(async () => {
    await db.end();
});

/**************************** POST /auth/token */

describe("POST, /auth/token", () => {
    it("works", async () => {
        const resp = await request(app).post("/auth/token").send({
            username: "testadmin",
            password: "adminpassword",
        });
        expect(resp.body).toEqual({
            token: expect.any(String),
        });
    });

    it("gives unauth with invalid admin", async () => {
        const resp = await request(app).post("/auth/token").send({
            username: "noooooope",
            password: "thisiswrong",
        });
        expect(resp.statusCode).toBe(401);
    });

    it("gives unauth with incorrect password", async () => {
        const resp = await request(app).post("/auth/token").send({
            username: "testadmin",
            password: "verywrong",
        });
        expect(resp.statusCode).toBe(401);
    });

    it("gives bad request with missing data", async () => {
        const resp = await request(app).post("/auth/token").send({
            username: "testadmin",
        });
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request with invalid data", async () => {
        const resp = await request(app).post("/auth/token").send({
            username: 98765,
            password: "ooops",
        });
        expect(resp.statusCode).toBe(400);
    });
});
