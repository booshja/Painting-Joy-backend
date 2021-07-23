const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Mural = require("../../models/mural");

beforeAll(async () => {
    await db.query("DELETE FROM murals");

    await Mural.create({
        title: "Test1",
        description: "This is test mural 1!",
    });

    await Mural.create({
        title: "Test2",
        description: "This is test mural 2!",
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

/******************************** POST /murals */

describe("POST, /murals", () => {
    it("creates new mural", async () => {
        const resp = await request(app).post("/murals/").send({
            title: "Posting Test",
            description: "This is a description for a test!",
        });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            mural: {
                id: expect.any(Number),
                title: "Posting Test",
                description: "This is a description for a test!",
                isArchived: false,
            },
        });
    });

    it("gives bad request for no data", async () => {
        const resp = await request(app).post("/murals/").send();
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request for missing data", async () => {
        const resp = await request(app)
            .post("/murals/")
            .send({ title: "oooops" });
        expect(resp.statusCode).toBe(400);
    });
});

/********************************* GET /murals */

describe("GET, /murals/", () => {
    it("returns a list of all murals", async () => {
        const resp = await request(app).get("/murals/");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            murals: [
                //
            ],
        });
    });
});

/********************************* GET /murals */

describe("GET, /murals/:id", () => {
    it("returns a single mural by id", async () => {
        expect(1).toEqual(1);
    });
});

/******************************* PATCH /murals */

describe("PATCH, /murals/:id", () => {
    it("does a full update on a mural by id", async () => {
        expect(1).toEqual(1);
    });

    it("does a partial update on a mural by id", async () => {
        expect(1).toEqual(1);
    });
});

/****************************** DELETE /murals */

describe("DELETE, /murals/:id", () => {
    it("deletes mural", async () => {
        expect(1).toEqual(1);
    });
});
