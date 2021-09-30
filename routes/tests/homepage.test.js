const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const { createAdminToken } = require("../../helpers/tokens");
const Homepage = require("../../models/homepage");

let adminToken;

beforeAll(async () => {
    await db.query("DELETE FROM homepages");

    await Homepage.create({
        greeting: "Initial test greeting",
        message: "Initial test message",
    });

    adminToken = createAdminToken({ isAdmin: true });
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

/******************************* GET /homepage */

describe("GET /homepage", () => {
    it("works", async () => {
        const resp = await request(app).get("/homepage");
        expect(resp.statusCode).toBe(200);
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
    it("works: authorized", async () => {
        const resp = await request(app)
            .put("/homepage")
            .send({
                greeting: "Hi this is a put test!",
                message: "This is a test put message!",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            homepage: {
                id: expect.any(Number),
                greeting: "Hi this is a put test!",
                message: "This is a test put message!",
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).put("/homepage").send({
            greeting: "Hello there!",
            message: "Welcome to my website!",
        });
        expect(resp.statusCode).toBe(401);
    });

    it("gives bad request with partial missing data", async () => {
        const resp = await request(app)
            .put("/homepage")
            .send({
                greeting: "Oh, hello!",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request with no data", async () => {
        const resp = await request(app)
            .put("/homepage")
            .send()
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(400);
    });
});
