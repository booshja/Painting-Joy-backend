const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const { createAdminToken } = require("../../helpers/tokens");
const Message = require("../../models/message");

let adminToken;
const testMessageIds = [];

beforeAll(async () => {
    await db.query("DELETE FROM messages");

    const msg1 = await Message.create({
        name: "Tester1",
        email: "1@email.com",
        message: "This is a message for the test 1!",
    });

    const msg2 = await Message.create({
        name: "Tester2",
        email: "2@email.com",
        message: "This is a message for the test 2!",
    });

    testMessageIds.push(msg1.id);
    testMessageIds.push(msg2.id);

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

/****************************** POST /messages */

describe("POST, /messages/", () => {
    it("creates a new message", async () => {
        const resp = await request(app).post("/messages/").send({
            name: "PostTest",
            email: "post@email.com",
            message: "This is a post request test!",
        });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            message: {
                id: expect.any(Number),
                email: "post@email.com",
                name: "PostTest",
                message: "This is a post request test!",
                received: expect.any(String),
            },
        });
    });

    it("gives bad request with partial missing data", async () => {
        const resp = await request(app).post("/messages/").send({
            message: "Oh, hello!",
        });
        expect(resp.statusCode).toEqual(400);
    });

    it("gives bad request with no data", async () => {
        const resp = await request(app).post("/messages/").send();
        expect(resp.statusCode).toEqual(400);
    });
});

/******************************* GET /messages */

describe("GET, /messages/", () => {
    it("returns a list of all messages", async () => {
        const resp = await request(app)
            .get("/messages")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            messages: [
                {
                    id: expect.any(Number),
                    name: "Tester1",
                    email: "1@email.com",
                    message: "This is a message for the test 1!",
                    received: expect.any(String),
                    isArchived: false,
                },
                {
                    id: expect.any(Number),
                    name: "Tester2",
                    email: "2@email.com",
                    message: "This is a message for the test 2!",
                    received: expect.any(String),
                    isArchived: false,
                },
            ],
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).get("/messages");
        expect(resp.statusCode).toBe(401);
    });
});

/******************* GET /messages/message/:id */

describe("GET, /messages/message/:id", () => {
    it("returns a message by id", async () => {
        const resp = await request(app)
            .get(`/messages/message/${testMessageIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            message: {
                id: testMessageIds[0],
                name: "Tester1",
                email: "1@email.com",
                message: "This is a message for the test 1!",
                received: expect.any(String),
                isArchived: false,
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).get("/messages/message/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found with invalid id", async () => {
        const resp = await request(app)
            .get("/messages/message/-1")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });
});

/************************ GET /messages/active */

describe("GET, /messages/active", () => {
    it("returns a list of all active messages", async () => {
        const resp = await request(app)
            .get("/messages/active")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            messages: [
                {
                    id: testMessageIds[0],
                    name: "Tester1",
                    email: "1@email.com",
                    message: "This is a message for the test 1!",
                    received: expect.any(String),
                },
                {
                    id: testMessageIds[1],
                    name: "Tester2",
                    email: "2@email.com",
                    message: "This is a message for the test 2!",
                    received: expect.any(String),
                },
            ],
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).get("/messages/active");
        expect(resp.statusCode).toBe(401);
    });
});

/********************** GET /messages/archived */

describe("GET, /messages/archived", () => {
    it("returns a list of all archived messages", async () => {
        const res = await db.query(`INSERT INTO messages(name,
                                                        email,
                                                        message,
                                                        is_archived)
                                        VALUES('archived',
                                                'archived@email.com',
                                                'This is archived.',
                                                true)
                                        RETURNING id`);
        const newMsgId = res.rows[0].id;

        const resp = await request(app)
            .get("/messages/archived")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            messages: [
                {
                    id: newMsgId,
                    name: "archived",
                    email: "archived@email.com",
                    message: "This is archived.",
                    received: expect.any(String),
                },
            ],
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).get("/messages/archived");
        expect(resp.statusCode).toBe(401);
    });
});

/***************** PATCH /messages/archive/:id */

describe("PATCH, /messages/archive/:id", () => {
    it("archives a message by id", async () => {
        const resp = await request(app)
            .patch(`/messages/archive/${testMessageIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            message: {
                id: testMessageIds[0],
                name: "Tester1",
                email: "1@email.com",
                message: "This is a message for the test 1!",
                received: expect.any(String),
                isArchived: true,
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/messages/archive/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for non-matching id", async () => {
        const resp = await request(app)
            .patch("/messages/archive/-1")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });
});

/*************** PATCH /messages/unarchive/:id */

describe("PATCH, /messages/unarchive/:id", () => {
    it("un-archives a message by id", async () => {
        const res = await db.query(`INSERT INTO messages(name,
                                                            email,
                                                            message,
                                                            is_archived)
                                            VALUES('archived',
                                                    'archived@email.com',
                                                    'This is archived.',
                                                    true)
                                            RETURNING id`);
        const newMsgId = res.rows[0].id;

        const resp = await request(app)
            .patch(`/messages/unarchive/${newMsgId}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            message: {
                id: newMsgId,
                name: "archived",
                email: "archived@email.com",
                message: "This is archived.",
                received: expect.any(String),
                isArchived: false,
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/messages/unarchive/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for non-matching id", async () => {
        const resp = await request(app)
            .patch("/messages/unarchive/-1")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });
});

/***************** DELETE /messages/delete/:id */

describe("DELETE, /messages/delete/:id", () => {
    it("deletes a message by id", async () => {
        const resp = await request(app)
            .delete(`/messages/delete/${testMessageIds[1]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            message: { msg: "Deleted." },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).delete("/messages/delete/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for non-matching id", async () => {
        const resp = await request(app)
            .delete(`/messages/delete/-1`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });
});
