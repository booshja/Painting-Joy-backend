const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Homepage = require("../../models/homepage");

const token = process.env.AUTH0_TEST_TOKEN;

beforeAll(async () => {
    await db.query("DELETE FROM homepages");

    await Homepage.update({
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

/************************ POST /homepage/image */

describe("POST /homepage/image", () => {
    it("works", async () => {
        const resp = await request(app)
            .post("/homepage/image")
            .attach("upload", "routes/tests/assets/Rainbow-logo_not_final.png")
            .set("Authorization", `Bearer ${token}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: { msg: "Upload successful." } });
    });
});

/************************* GET /homepage/image */

describe("GET /homepage/image", () => {
    it("works", async () => {
        await request(app)
            .post("/homepage/image")
            .attach("upload", "routes/tests/assets/Rainbow-logo_not_final.png")
            .set("Authorization", `Bearer ${token}`);

        const resp = await request(app).get("/homepage/image");

        expect(resp.statusCode).toBe(200);
        expect(resp.headers["content-type"]).toEqual("image/png");
    });
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
                item_id: expect.any(Number),
                item_title: expect.any(String),
                mural_id: expect.any(Number),
                mural_title: expect.any(String),
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
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            homepage: {
                id: expect.any(Number),
                greeting: "Hi this is a put test!",
                message: "This is a test put message!",
            },
        });
    });

    it("gives unauth for unauthorized", async () => {
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
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request with no data", async () => {
        const resp = await request(app)
            .put("/homepage")
            .send()
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
    });
});

/************************* DELETE /homepage/image */

describe("DELETE /homepage/image", () => {
    it("works", async () => {
        await request(app)
            .post("/homepage/image")
            .attach("upload", "routes/tests/assets/Rainbow-logo_not_final.png")
            .set("Authorization", `Bearer ${token}`);

        const resp = await request(app)
            .delete("/homepage/image")
            .set("Authorization", `Bearer ${token}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: { msg: "Deleted." } });
    });
});
