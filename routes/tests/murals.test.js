const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Mural = require("../../models/mural");

const token = process.env.AUTH0_TEST_TOKEN;
const testMuralIds = [];

beforeAll(async () => {
    await db.query("DELETE FROM murals");

    const mural1 = await Mural.create({
        title: "Test1",
        description: "This is test mural 1!",
    });

    const mural2 = await Mural.create({
        title: "Test2",
        description: "This is test mural 2!",
    });

    const mural3 = await Mural.create({
        title: "Test3",
        description: "This is test mural 3!",
    });

    await Mural.archive(mural3.id);

    testMuralIds.push(mural1.id);
    testMuralIds.push(mural2.id);
    testMuralIds.push(mural3.id);
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
        const resp = await request(app)
            .post("/murals/")
            .send({
                title: "Posting Test",
                description: "This is a description for a test!",
            })
            .set("Authorization", `Bearer ${token}`);
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

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).post("/murals/");
        expect(resp.statusCode).toBe(401);
    });

    it("gives bad request for no data", async () => {
        const resp = await request(app)
            .post("/murals/")
            .send()
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request for missing data", async () => {
        const resp = await request(app)
            .post("/murals/")
            .send({ title: "oooops" })
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
    });
});

/********** POST /murals/upload/:muralId/image/:imageNum */

describe("POST /murals/upload/:muralId/image/:imageNum", () => {
    it("works", async () => {
        const resp = await request(app)
            .post(`/murals/upload/${testMuralIds[0]}/image/1`)
            .attach("upload", "routes/tests/assets/Rainbow-logo_not_final.png")
            .set("Authorization", `Bearer ${token}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: { msg: "Upload successful: image1" },
        });
    });
});

/************* GET /murals/mural/:muralId/image/:imageNum */

describe("GET /homepage/image", () => {
    it("works", async () => {
        await request(app)
            .post(`/murals/upload/${testMuralIds[0]}/image/1`)
            .attach("upload", "routes/tests/assets/Rainbow-logo_not_final.png")
            .set("Authorization", `Bearer ${token}`);

        const resp = await request(app).get(
            `/murals/mural/${testMuralIds[0]}/image/1`
        );

        expect(resp.statusCode).toBe(200);
        expect(resp.headers["content-type"]).toEqual("image/png");
    });
});

/********************************* GET /murals */

describe("GET, /murals/", () => {
    it("returns a list of all murals", async () => {
        const resp = await request(app)
            .get("/murals/")
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            murals: [
                {
                    id: testMuralIds[0],
                    title: "Test1",
                    description: "This is test mural 1!",
                    isArchived: false,
                },
                {
                    id: testMuralIds[1],
                    title: "Test2",
                    description: "This is test mural 2!",
                    isArchived: false,
                },
                {
                    id: testMuralIds[2],
                    title: "Test3",
                    description: "This is test mural 3!",
                    isArchived: true,
                },
            ],
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).get("/murals/");
        expect(resp.statusCode).toBe(401);
    });
});

/************************** GET /murals/active */

describe("GET, /murals/active", () => {
    it("returns a list of all non-archived murals", async () => {
        const resp = await request(app).get("/murals/active");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            murals: [
                {
                    id: testMuralIds[0],
                    title: "Test1",
                    description: "This is test mural 1!",
                },
                {
                    id: testMuralIds[1],
                    title: "Test2",
                    description: "This is test mural 2!",
                },
            ],
        });
    });
});

/*********************** GET /murals/mural/:id */

describe("GET, /murals/mural/:id", () => {
    it("returns a single mural by id", async () => {
        const resp = await request(app).get(`/murals/mural/${testMuralIds[0]}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            mural: {
                id: testMuralIds[0],
                title: "Test1",
                description: "This is test mural 1!",
                image1: null,
                image2: null,
                image3: null,
            },
        });
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app).get("/murals/mural/-1");
        expect(resp.statusCode).toBe(404);
    });
});

/********************* PATCH /murals/mural/:id */

describe("PATCH, /murals/mural/:id", () => {
    it("does a full update on a mural by id", async () => {
        const resp = await request(app)
            .patch(`/murals/mural/${testMuralIds[0]}`)
            .send({
                title: "ChangedTest1",
                description: "This description was changed!",
            })
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            mural: {
                id: testMuralIds[0],
                title: "ChangedTest1",
                description: "This description was changed!",
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/murals/mural/1");
        expect(resp.statusCode).toBe(401);
    });

    it("does a partial update on a mural by id", async () => {
        const resp = await request(app)
            .patch(`/murals/mural/${testMuralIds[0]}`)
            .send({ description: "This was changed again!" })
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            mural: {
                id: testMuralIds[0],
                title: "Test1",
                description: "This was changed again!",
            },
        });
    });

    it("gives not found if invalid id", async () => {
        const resp = await request(app)
            .patch("/murals/mural/-1")
            .send({ title: "uh oh!" })
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(404);
    });
});

/************* PATCH /murals/mural/:id/archive */

describe("PATCH, /murals/mural/:id/archive", () => {
    it("archives a mural by id", async () => {
        const resp = await request(app)
            .patch(`/murals/mural/${testMuralIds[1]}/archive`)
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            mural: {
                id: testMuralIds[1],
                title: "Test2",
                description: "This is test mural 2!",
                isArchived: true,
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/murals/mural/1/archive");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found with invalid id", async () => {
        const resp = await request(app)
            .patch(`/murals/mural/-2/archive`)
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(404);
    });
});

/*********** PATCH /murals/mural/:id/unarchive */

describe("PATCH, /murals/mural/:id/unarchive", () => {
    it("un-archives a mural by id", async () => {
        const resp = await request(app)
            .patch(`/murals/mural/${testMuralIds[2]}/unarchive`)
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            mural: {
                id: testMuralIds[2],
                title: "Test3",
                description: "This is test mural 3!",
                isArchived: false,
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/murals/mural/1/unarchive");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found with invalid id", async () => {
        const resp = await request(app)
            .patch("/murals/mural/-2/unarchive")
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(404);
    });
});

/******************** DELETE /murals/mural/:id */

describe("DELETE, /murals/mural/:id", () => {
    it("deletes mural by id", async () => {
        const resp = await request(app)
            .delete(`/murals/mural/${testMuralIds[2]}`)
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: { msg: "Deleted." },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).delete("/murals/mural/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found with invalid id", async () => {
        const resp = await request(app)
            .delete("/murals/mural/-2")
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(404);
    });
});

/********* DELETE /murals/mural/:muralId/image/:imageNum */

describe("DELETE /mural/:muralId/image/:imageNum", () => {
    it("works", async () => {
        await request(app)
            .post(`/murals/upload/${testMuralIds[0]}/image/1`)
            .attach("upload", "routes/tests/assets/Rainbow-logo_not_final.png")
            .set("Authorization", `Bearer ${token}`);

        const resp = await request(app)
            .delete(`/murals/mural/${testMuralIds[0]}/image/1`)
            .set("Authorization", `Bearer ${token}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: { msg: "Deleted: image1" } });
    });
});
