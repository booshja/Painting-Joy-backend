const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const { createAdminToken } = require("../../helpers/tokens");
const IGPost = require("../../models/igpost");

const testIgPostIds = [];
let adminToken;

beforeAll(async () => {
    await db.query("DELETE FROM igposts");

    const igpost1 = await IGPost.add({
        igId: "abcd12341",
        caption: "This is a test caption 1!",
        permUrl: "example.com/1",
        imageUrl: "example.com/image1.jpg",
    });
    testIgPostIds.push(igpost1.igId);

    const igpost2 = await IGPost.add({
        igId: "abcd12342",
        caption: "This is a test caption 2!",
        permUrl: "example.com/2",
        imageUrl: "example.com/image2.jpg",
    });
    testIgPostIds.push(igpost2.igId);

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

/****************************** POST /igposts/ */

describe("POST, /igposts/", () => {
    it("creates a new igpost", async () => {
        const resp = await request(app)
            .post("/igposts/")
            .send({
                igId: "new123",
                caption: "This is newly added!",
                permUrl: "www.example.com/new1",
                imageUrl: "www.example.com/new1.jpg",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            igPost: {
                igId: "new123",
                caption: "This is newly added!",
                permUrl: "www.example.com/new1",
                imageUrl: "www.example.com/new1.jpg",
            },
        });
    });

    it("gives unauth if non-admin", async () => {
        const resp = await request(app).post("/igposts/").send({
            igId: "nope",
            caption: "nuh uh",
            permUrl: "nooope",
            imageUrl: "still-no",
        });
        expect(resp.statusCode).toBe(401);
    });

    it("gives bad request if no data", async () => {
        const resp = await request(app)
            .post("/igposts/")
            .send()
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request if nmissing data", async () => {
        const resp = await request(app)
            .post("/igposts/")
            .send({
                igId: "nahhh",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(400);
    });
});

/******************************* GET /igposts/ */

describe("GET, /igposts/", () => {
    it("gets a list of all the igposts", async () => {
        const resp = await request(app).get("/igposts/");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            igPosts: [
                {
                    igId: "abcd12341",
                    caption: "This is a test caption 1!",
                    permUrl: "example.com/1",
                    imageUrl: "example.com/image1.jpg",
                },
                {
                    igId: "abcd12342",
                    caption: "This is a test caption 2!",
                    permUrl: "example.com/2",
                    imageUrl: "example.com/image2.jpg",
                },
            ],
        });
    });
});

/*********************** GET /igposts/:id */

describe("GET, /igposts/post/:id", () => {
    it("gets an igpost by id", async () => {
        const resp = await request(app)
            .get(`/igposts/post/${testIgPostIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            igPost: {
                igId: "abcd12341",
                caption: "This is a test caption 1!",
                permUrl: "example.com/1",
                imageUrl: "example.com/image1.jpg",
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).get("/igposts/post/2");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .get("/igposts/post/-1")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(404);
    });
});

/****************** DELETE /igposts/:id */

describe("DELETE, /igposts/:id", () => {
    it("deletes an igpost by id", async () => {
        const resp = await request(app)
            .delete(`/igposts/delete/${testIgPostIds[1]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: {
                msg: "Deleted.",
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).delete("/igposts/delete/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .delete("/igposts/delete/-1")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(404);
    });
});
