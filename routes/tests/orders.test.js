const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Item = require("../../models/item");
const Order = require("../../models/order");

const testItemIds = [];
let testOrderIds = [];

beforeAll(async () => {
    await db.query("DELETE FROM orders");
    await db.query("DELETE FROM items");
    await db.query("DELETE FROM orders_items");

    const item1 = await Item.create({
        name: "Item1",
        description: "This is item 1!",
        price: 100.99,
        quantity: 1,
    });
    testItemIds.push(item1.id);

    const item2 = await Item.create({
        name: "Item2",
        description: "This is item 2!",
        price: 200.99,
        quantity: 2,
    });
    testItemIds.push(item2.id);

    const order1 = await Order.create(
        {
            email: "ralph@email.com",
            name: "Ralph Schnauzer",
            street: "123 Space Needle Dr.",
            unit: null,
            city: "Seattle",
            stateCode: "WA",
            zipcode: 99999,
            phone: 5552065555,
            transactionId: "abcd1234",
            status: "Confirmed",
            amount: 240,
        },
        [item1.id, item2.id]
    );
    testOrderIds.push(order1.id);

    const order2 = await Order.create({
        email: "krew@email.com",
        name: "Krew Corgi",
        street: "123 Space Needle Ctr.",
        unit: "Unit 1299",
        city: "Seattle",
        stateCode: "WA",
        zipcode: 99599,
        phone: 5558015555,
        transactionId: "1234abcd",
        status: "Confirmed",
        amount: 42990.99,
    });
    testOrderIds.push(order2.id);
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

/******************************* POST /orders/ */

describe("/orders/", () => {
    it("creates a new order without items", async () => {
        const resp = await request(app)
            .post("/orders/")
            .send({
                order: {
                    email: "new@email.com",
                    name: "Mr. New",
                    street: "123 Space Needle Ct.",
                    unit: "Apt 122",
                    city: "Seattle",
                    stateCode: "WA",
                    zipcode: 98765,
                    phone: 5554255555,
                    transactionId: "dcba4321",
                    status: "Confirmed",
                    amount: 999.99,
                },
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            order: {
                id: expect.any(Number),
                email: "new@email.com",
                name: "Mr. New",
                street: "123 Space Needle Ct.",
                unit: "Apt 122",
                city: "Seattle",
                stateCode: "WA",
                zipcode: 98765,
                phone: "5554255555",
                transactionId: "dcba4321",
                status: "Confirmed",
                amount: "999.99",
                listItems: [],
            },
        });
    });

    it("creates a new order with items", async () => {
        const resp = await request(app)
            .post("/orders/")
            .send({
                order: {
                    email: "new2@email.com",
                    name: "Mr. New New",
                    street: "123 Space Needle Blvd.",
                    unit: "Apt 211",
                    city: "Seattle",
                    stateCode: "WA",
                    zipcode: 98789,
                    phone: 5554255555,
                    transactionId: "dcbaxxxx4321",
                    status: "Confirmed",
                    amount: 1999.99,
                },
                ids: [testItemIds[0], testItemIds[1]],
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            order: {
                id: expect.any(Number),
                email: "new2@email.com",
                name: "Mr. New New",
                street: "123 Space Needle Blvd.",
                unit: "Apt 211",
                city: "Seattle",
                stateCode: "WA",
                zipcode: 98789,
                phone: "5554255555",
                transactionId: "dcbaxxxx4321",
                status: "Confirmed",
                amount: "1999.99",
                listItems: [
                    {
                        id: testItemIds[0],
                        name: "Item1",
                        description: "This is item 1!",
                        price: "100.99",
                        quantity: 1,
                        created: expect.any(String),
                        isSold: false,
                    },
                    {
                        id: testItemIds[1],
                        name: "Item2",
                        description: "This is item 2!",
                        price: "200.99",
                        quantity: 2,
                        created: expect.any(String),
                        isSold: false,
                    },
                ],
            },
        });
    });

    it("gives bad request for no data", async () => {
        const resp = await request(app).post("/orders/").send();
        expect(resp.statusCode).toBe(400);
    });

    it("gives bad request for incomplete data", async () => {
        const resp = await request(app).post("/orders/").send({
            email: "nope@email.com",
            name: "No sir",
        });
        expect(resp.statusCode).toBe(400);
    });
});

/*********** POST /orders/:orderId/add/:itemId */

describe("/orders/:orderId/add/:itemId", () => {
    it("adds an item to an order by orderId & itemId", async () => {
        const resp = await request(app).post(
            `/orders/${testOrderIds[0]}/add/${testItemIds[0]}`
        );
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[0],
                email: "ralph@email.com",
                name: "Ralph Schnauzer",
                street: "123 Space Needle Dr.",
                unit: null,
                city: "Seattle",
                stateCode: "WA",
                zipcode: 99999,
                phone: "5552065555",
                transactionId: "abcd1234",
                status: "Confirmed",
                amount: "240",
                listItems: [
                    {
                        name: "Item1",
                        description: "This is item 1!",
                        price: "100.99",
                    },
                    {
                        name: "Item2",
                        description: "This is item 2!",
                        price: "200.99",
                    },
                    {
                        name: "Item1",
                        description: "This is item 1!",
                        price: "100.99",
                    },
                ],
            },
        });
    });

    it("gives not found for invalid order id", async () => {
        const resp = await request(app).post(
            `/orders/${-1}/add/${testItemIds[1]}`
        );
        expect(resp.statusCode).toBe(404);
    });

    it("gives not found for invalid item id", async () => {
        const resp = await request(app).post(
            `/orders/${testOrderIds[0]}/add/${-1}`
        );
        expect(resp.statusCode).toBe(404);
    });
});

/************************ GET /orders/:orderId */

describe("/orders/:orderId", () => {
    it("gets an order by id", async () => {
        const resp = await request(app).get(`/orders/${testOrderIds[0]}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[0],
                email: "ralph@email.com",
                name: "Ralph Schnauzer",
                street: "123 Space Needle Dr.",
                unit: null,
                city: "Seattle",
                stateCode: "WA",
                zipcode: 99999,
                phone: "5552065555",
                transactionId: "abcd1234",
                status: "Confirmed",
                amount: "240",
                listItems: [
                    {
                        name: "Item1",
                        description: "This is item 1!",
                        price: "100.99",
                        quantity: 1,
                    },
                    {
                        name: "Item2",
                        description: "This is item 2!",
                        price: "200.99",
                        quantity: 2,
                    },
                ],
            },
        });
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app).get(`/orders/${-1}`);
        expect(resp.statusCode).toBe(404);
    });
});

/******************************** GET /orders/ */

describe("/orders/", () => {
    it("gets a list of all orders", async () => {
        const resp = await request(app).get("/orders/");
        expect(resp.statusCode).toBe(200);
        expect(resp.body.orders).toEqual([
            {
                id: testOrderIds[0],
                email: "ralph@email.com",
                name: "Ralph Schnauzer",
                street: "123 Space Needle Dr.",
                unit: null,
                city: "Seattle",
                stateCode: "WA",
                zipcode: 99999,
                phone: "5552065555",
                transactionId: "abcd1234",
                status: "Confirmed",
                amount: "240",
            },
            {
                id: testOrderIds[1],
                email: "krew@email.com",
                name: "Krew Corgi",
                street: "123 Space Needle Ctr.",
                unit: "Unit 1299",
                city: "Seattle",
                stateCode: "WA",
                zipcode: 99599,
                phone: "5558015555",
                transactionId: "1234abcd",
                status: "Confirmed",
                amount: "42990.99",
            },
        ]);
    });
});

/***************** PATCH /orders/:orderId/ship */

describe("/orders/:orderId/ship", () => {
    it("updates an order's status to 'Shipped' by id", async () => {
        const resp = await request(app).patch(
            `/orders/${testOrderIds[1]}/ship`
        );
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[1],
                email: "krew@email.com",
                name: "Krew Corgi",
                street: "123 Space Needle Ctr.",
                unit: "Unit 1299",
                city: "Seattle",
                stateCode: "WA",
                zipcode: 99599,
                phone: "5558015555",
                transactionId: "1234abcd",
                status: "Shipped",
                amount: "42990.99",
            },
        });
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app).patch(`/orders/${-1}/ship`);
        expect(resp.statusCode).toBe(404);
    });
});

/************* PATCH /orders/:orderId/complete */

describe("/orders/:orderId/complete", () => {
    it("updates an order's status to 'Completed' by id", async () => {
        const resp = await request(app).patch(
            `/orders/${testOrderIds[1]}/complete`
        );
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[1],
                email: "krew@email.com",
                name: "Krew Corgi",
                street: "123 Space Needle Ctr.",
                unit: "Unit 1299",
                city: "Seattle",
                stateCode: "WA",
                zipcode: 99599,
                phone: "5558015555",
                transactionId: "1234abcd",
                status: "Completed",
                amount: "42990.99",
            },
        });
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app).patch(`/orders/${-1}/complete`);
        expect(resp.statusCode).toBe(404);
    });
});

/******* PATCH /orders/:orderId/remove/:itemId */

describe("/orders/:orderId/remove/:itemId", () => {
    it("removes an item from an order by orderId & itemId", async () => {
        const resp = await request(app).patch(
            `/orders/${testOrderIds[0]}/remove/${testItemIds[1]}`
        );
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: {
                msg: "Item removed.",
            },
        });
    });

    it("gives not found for invalid order id", async () => {
        const resp = await request(app).patch(
            `/orders/${-1}/remove/${testItemIds[0]}`
        );
        expect(resp.statusCode).toBe(404);
    });

    it("gives not found for invalid item id", async () => {
        const resp = await request(app).get(
            `/orders/${testOrderIds[0]}/remove/${-1}`
        );
        expect(resp.statusCode).toBe(404);
    });
});

/********************* DELETE /orders/:orderId */

// describe("/orders/:orderId", () => {
//     it("deltes an order by id", async () => {
//         const resp = await request(app).delete(`/orders/${testOrderIds[0]}`);
//         expect(resp.statusCode).toBe(200);
//         expect(resp.body).toEqual({
//             message: {
//                 msg: "Deleted.",
//             },
//         });

//         const checkResp = await request(app).get(`/orders/${testOrderIds[0]}`);
//         expect(checkResp.statusCode).toEqual(404);
//     });

//     it("gives not found for invalid id", async () => {
//         const resp = await request(app).delete(`/orders/${-1}`);
//         expect(resp.statusCode).toBe(404);
//     });
// });
