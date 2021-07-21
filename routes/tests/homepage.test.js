const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Homepage = require("../../models/homepage");

beforeAll(async () => {
    await db.query("DELETE FROM homepages");

    await Homepage.create({
        greeting: "Initial test greeting",
        message: "Initial test message",
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

/****************************** POST /homepage */

describe("POST /homepage", () => {
    test("works: unathorized", async () => {
        const resp = await request(app).post("/homepage").send({
            greeting: "Hi this is a test!",
            message: "This is a test message!",
        });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            homepage: {
                id: expect.any(Number),
                greeting: "Hi this is a test!",
                message: "This is a test message!",
            },
        });
    });

    test("bad request with partial missing data", async () => {
        const resp = await request(app).post("/homepage").send({
            greeting: "Oh, hello!",
        });
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with no data", async () => {
        const resp = await request(app).post("/homepage").send();
        expect(resp.statusCode).toEqual(400);
    });
});

/******************************* GET /homepage */

describe("GET /homepage", () => {
    test("works", async () => {
        const resp = await request(app).get("/homepage");
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            homepage: {
                id: expect.any(Number),
                greeting: "Initial test greeting",
                message: "Initial test message",
            },
        });
    });
});

/******************************* PUT /homepage */

describe("PUT /homepage", () => {
    test("works: unathorized", async () => {
        const resp = await request(app).put("/homepage").send({
            greeting: "Hi this is a put test!",
            message: "This is a test put message!",
        });
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            homepage: {
                id: expect.any(Number),
                greeting: "Hi this is a put test!",
                message: "This is a test put message!",
            },
        });
    });

    test("bad request with partial missing data", async () => {
        const resp = await request(app).put("/homepage").send({
            greeting: "Oh, hello!",
        });
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with no data", async () => {
        const resp = await request(app).put("/homepage").send();
        expect(resp.statusCode).toEqual(400);
    });
});
