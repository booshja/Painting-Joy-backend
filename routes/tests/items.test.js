const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Item = require("../../models/item");

const testItemIds = [];

beforeAll(async () => {
    await db.query("DELETE FROM items");

    const item1 = await Item.create({
        name: "TestItem1",
        description: "This is test item 1!",
        price: 100.99,
        quantity: 1,
    });
    testItemIds.push(item1.id);

    const item2 = await Item.create({
        name: "TestItem2",
        description: "This is test item 2!",
        price: 200.99,
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
        const resp = await request(app).post("/items/").send({
            name: "NewItem",
            description: "This is a new item!",
            price: 99.99,
            quantity: 9,
        });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            item: {
                id: expect.any(Number),
                name: "NewItem",
                description: "This is a new item!",
                price: "99.99",
                quantity: 9,
                created: expect.any(String),
                isSold: false,
            },
        });
    });

    it("gives bad request for no input", async () => {
        const resp = await request(app).post("/items").send();
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request for missing input", async () => {
        const resp = await request(app).post("/items").send({ name: "Uh oh!" });
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
                    quantity: 1,
                    created: expect.any(String),
                    isSold: false,
                },
                {
                    id: testItemIds[1],
                    name: "TestItem2",
                    description: "This is test item 2!",
                    price: "200.99",
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
                quantity: 1,
                created: expect.any(String),
                isSold: false,
            },
        });
    });
});

/************************ GET /items/available */

describe("GET, /items/available", () => {
    it("gets list of all available items", async () => {
        const resp = await request(app).get("/items/available");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            items: [
                {
                    id: testItemIds[0],
                    name: "TestItem1",
                    description: "This is test item 1!",
                    price: "100.99",
                    quantity: 1,
                    created: expect.any(String),
                },
                {
                    id: testItemIds[1],
                    name: "TestItem2",
                    description: "This is test item 2!",
                    price: "200.99",
                    quantity: 2,
                    created: expect.any(String),
                },
            ],
        });
    });
});

/***************************** GET /items/sold */

describe("GET, /items/sold", () => {
    it("gets list of all sold items", async () => {
        const res = await db.query(
            `INSERT INTO items(name,
                                description,
                                price,
                                quantity,
                                is_sold)
                VALUES('Sold Item',
                        'This item is sold!',
                        120.99,
                        0,
                        true)
                RETURNING id`
        );
        const itemId = res.rows[0].id;

        const resp = await request(app).get("/items/sold");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            items: [
                {
                    id: itemId,
                    name: "Sold Item",
                    description: "This item is sold!",
                    price: "120.99",
                    quantity: 0,
                    created: expect.any(String),
                },
            ],
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
                quantity: 7,
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[1],
                name: "Updated",
                description: "This has now been updated!",
                price: "1.99",
                quantity: 7,
                created: expect.any(String),
                isSold: false,
            },
        });
    });

    it("does a partial update on an item", async () => {
        const resp = await request(app)
            .patch(`/items/update/${testItemIds[1]}`)
            .send({
                name: "Updated Twice!",
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[1],
                name: "Updated Twice!",
                description: "This is test item 2!",
                price: "200.99",
                quantity: 2,
                created: expect.any(String),
                isSold: false,
            },
        });
    });

    it("gives bad request for no data", async () => {
        const resp = await request(app)
            .patch(`/items/update/${testItemIds[1]}`)
            .send();
        expect(resp.statusCode).toBe(400);
    });
});

/*********************** PATCH /items/sell/:id */

describe("PATCH, /items/sell/:id", () => {
    it("decreases quantity: 2+ quantity", async () => {
        const resp = await request(app).patch(`/items/sell/${testItemIds[1]}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[1],
                name: "TestItem2",
                description: "This is test item 2!",
                price: "200.99",
                quantity: 1,
                created: expect.any(String),
                isSold: false,
            },
        });
    });

    it("decreases quantity and marks sold: 1 quantity", async () => {
        const resp = await request(app).patch(`/items/sell/${testItemIds[0]}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[0],
                name: "TestItem1",
                description: "This is test item 1!",
                price: "100.99",
                quantity: 0,
                created: expect.any(String),
                isSold: true,
            },
        });
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app).patch(`/items/sell/-1`);
        expect(resp.statusCode).toBe(404);
    });
});

/*********************** PATCH /items/sold/:id */

describe("PATCH, /items/sold/:id", () => {
    it("decreases quantity and marks sold", async () => {
        const resp = await request(app).patch(`/items/sold/${testItemIds[1]}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                id: testItemIds[1],
                name: "TestItem2",
                description: "This is test item 2!",
                price: "200.99",
                quantity: 0,
                created: expect.any(String),
                isSold: true,
            },
        });
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app).patch(`/items/sold/-1`);
        expect(resp.statusCode).toBe(404);
    });
});

/******************** DELETE /items/delete/:id */

describe("DELETE, /items/delete/:id", () => {
    it("deletes an item by id", async () => {
        const resp = await request(app).delete(
            `/items/delete/${testItemIds[0]}`
        );
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: {
                msg: "Deleted.",
            },
        });
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app).delete(`/items/delete/-1`);
        expect(resp.statusCode).toBe(404);
    });
});
