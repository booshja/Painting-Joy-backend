const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const IGPost = require("../../models/igpost");

testIgPostIds = [];

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
        const resp = await request(app).post("/igposts/").send({
            igId: "new123",
            caption: "This is newly added!",
            permUrl: "www.example.com/new1",
            imageUrl: "www.example.com/new1.jpg",
        });
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

    it("gives bad request if no data", async () => {
        const resp = await request(app).post("/igposts/").send();
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request if nmissing data", async () => {
        const resp = await request(app).post("/igposts/").send({
            igId: "nahhh",
        });
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

// describe("GET, /igposts/:id", () => {
//     it("gets an igpost by id", async () => {
//         const resp = await request(app).get(`/igposts/${testIgPostIds[0]}`);
//         expect(resp.statusCode).toBe(200);
//         expect(resp.body).toEqual({
//             igPost: {
//                 igId: "abcd12341",
//                 caption: "This is a test caption 1!",
//                 permUrl: "example.com/1",
//                 imageUrl: "example.com/image1.jpg",
//             },
//         });
//     });

//     it("gives not found for invalid id", async () => {
//         const resp = await request(app).get("/igposts/-1");
//         expect(resp.statusCode).toBe(400);
//     });
// });

/****************** DELETE /igposts/:id */

// describe("DELETE, /igposts/:id", () => {
//     it("deletes an igpost by id", async () => {
//         const resp = await request(app).delete(`/igposts/${testIgPostIds[0]}`);
//         expect(resp.statusCode).toBe(200);
//         expect(resp.body).toEqual({
//             message: {
//                 msg: "Deleted.",
//             },
//         });
//     });

//     it("gives not found for invalid id", async () => {
//         const resp = await request(app).delete("/igposts/-1");
//         expect(resp.statusCode).toBe(400);
//     });
// });
