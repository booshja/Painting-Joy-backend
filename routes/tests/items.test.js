const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Item = require("../../models/item");

const token = process.env.AUTH0_TEST_TOKEN;
const testItemIds = [];

beforeAll(async () => {
    await db.query("DELETE FROM items");

    const item1 = await Item.create({
        name: "TestItem1",
        description: "This is test item 1!",
        price: 100.99,
        shipping: 10.99,
        quantity: 1,
    });
    testItemIds.push(item1.id);

    const item2 = await Item.create({
        name: "TestItem2",
        description: "This is test item 2!",
        price: 200.99,
        shipping: 20.99,
        quantity: 2,
    });
    testItemIds.push(item2.id);
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

/******************************** POST /items/ */

describe("POST, /items/", () => {
    it("creates an item", async () => {
        const resp = await request(app)
            .post("/items/")
            .send({
                name: "NewItem",
                description: "This is a new item!",
                price: 99.99,
                shipping: 100.88,
                quantity: 9,
            })
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            item: {
                id: expect.any(Number),
                name: "NewItem",
                description: "This is a new item!",
                price: "99.99",
                shipping: "100.88",
                quantity: 9,
                created: expect.any(String),
                isSold: false,
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).post("/items").send();
        expect(resp.statusCode).toBe(401);
    });

    it("gives bad request for no input", async () => {
        const resp = await request(app)
            .post("/items")
            .send()
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request for missing input", async () => {
        const resp = await request(app)
            .post("/items")
            .send({ name: "Uh oh!" })
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
    });
});

/********************************* GET /items/ */

describe("GET, /items/", () => {
    it("gets a list of all items", async () => {
        const resp = await request(app).get("/items/");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            items: [
                {
                    id: testItemIds[0],
                    name: "TestItem1",
                    description: "This is test item 1!",
                    price: "100.99",
                    shipping: "10.99",
                    quantity: 1,
                    created: expect.any(String),
                    isSold: false,
                },
                {
                    id: testItemIds[1],
                    name: "TestItem2",
                    description: "This is test item 2!",
                    price: "200.99",
                    shipping: "20.99",
                    quantity: 2,
                    created: expect.any(String),
                    isSold: false,
                },
            ],
        });
    });
});

/************************* GET /items/item/:id */

describe("GET, /items/item/:id", () => {
    it("get an item by id", async () => {
        const resp = await request(app).get(`/items/item/${testItemIds[0]}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[0],
                name: "TestItem1",
                description: "This is test item 1!",
                price: "100.99",
                shipping: "10.99",
                quantity: 1,
                created: expect.any(String),
                isSold: false,
            },
        });
    });
});

/********************* PATCH /items/update/:id */

describe("PATCH, /items/update/:id", () => {
    it("does a full update on an item", async () => {
        const resp = await request(app)
            .patch(`/items/update/${testItemIds[1]}`)
            .send({
                name: "Updated",
                description: "This has now been updated!",
                price: 1.99,
                shipping: 10000.99,
                quantity: 7,
            })
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[1],
                name: "Updated",
                description: "This has now been updated!",
                price: "1.99",
                shipping: "10000.99",
                quantity: 7,
                created: expect.any(String),
                isSold: false,
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/items/update/1").send({
            name: "nuh-uh",
        });
        expect(resp.statusCode).toBe(401);
    });

    it("does a partial update on an item", async () => {
        const resp = await request(app)
            .patch(`/items/update/${testItemIds[1]}`)
            .send({
                name: "Updated Twice!",
            })
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[1],
                name: "Updated Twice!",
                description: "This is test item 2!",
                price: "200.99",
                shipping: "20.99",
                quantity: 2,
                created: expect.any(String),
                isSold: false,
            },
        });
    });

    it("gives bad request for no data", async () => {
        const resp = await request(app)
            .patch(`/items/update/${testItemIds[1]}`)
            .send()
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
    });
});

/*********************** PATCH /items/sold/:id */

describe("PATCH, /items/sold/:id", () => {
    it("decreases quantity and marks sold", async () => {
        const resp = await request(app)
            .patch(`/items/sold/${testItemIds[1]}`)
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[1],
                name: "TestItem2",
                description: "This is test item 2!",
                price: "200.99",
                shipping: "20.99",
                quantity: 0,
                created: expect.any(String),
                isSold: true,
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/items/sold/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .patch(`/items/sold/-1`)
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(404);
    });
});

/******************** DELETE /items/delete/:id */

describe("DELETE, /items/delete/:id", () => {
    it("deletes an item by id", async () => {
        const resp = await request(app)
            .delete(`/items/delete/${testItemIds[0]}`)
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: {
                msg: "Deleted.",
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).delete("/items/delete/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .delete(`/items/delete/-1`)
            .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(404);
    });
});
