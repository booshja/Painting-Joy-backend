const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const { createAdminToken } = require("../../helpers/tokens");
const { calculateOrderAmount } = require("../orders");
const Item = require("../../models/item");
const Order = require("../../models/order");

let adminToken;
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
        shipping: 1.99,
    });
    testItemIds.push(item1.id);

    const item2 = await Item.create({
        name: "Item2",
        description: "This is item 2!",
        price: 200.99,
        quantity: 2,
        shipping: 2.99,
    });
    testItemIds.push(item2.id);

    const order1 = await Order.create();
    testOrderIds.push(order1.id);

    const order2 = await Order.create();
    testOrderIds.push(order2.id);

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

/*********************** POST /orders/checkout */

describe("POST, /orders/checkout", () => {
    it("creates order, adds item to it, removes items from inventory", async () => {
        const resp = await request(app)
            .post(`/orders/checkout`)
            .send({
                items: [
                    { id: testItemIds[0], quantity: 1 },
                    { id: -1, quantity: 2 },
                ],
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: expect.any(Number),
                email: "Pending",
                name: "Pending",
                phone: "Pending",
                street: "Pending",
                unit: "Pending",
                city: "Pending",
                stateCode: "Pending",
                zipcode: "Pending",
                transactionId: "Pending",
                amount: "0",
                status: "Pending",
                listItems: [
                    {
                        id: expect.any(Number),
                        name: "Item1",
                        description: "This is item 1!",
                        price: "100.99",
                        shipping: "1.99",
                        quantity: 1,
                    },
                ],
            },
            notAdded: [-1, -1],
        });
    });

    it("gives bad request with no body", async () => {
        const resp = await request(app).post(`/orders/checkout`);
        expect(resp.statusCode).toBe(400);
    });
});

/************ POST /orders/order/:orderId/info */

describe("POST, /orders/order/:orderId/info", () => {
    it("adds customer data to order by orderId", async () => {
        const resp = await request(app)
            .post(`/orders/order/${testOrderIds[0]}/info`)
            .send({
                email: "info@email.com",
                name: "Info Tester",
                street: "987 State St.",
                unit: null,
                city: "Denver",
                stateCode: "CO",
                zipcode: 12321,
                phone: 6665554444,
                amount: 99.99,
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[0],
                email: "info@email.com",
                name: "Info Tester",
                street: "987 State St.",
                unit: null,
                city: "Denver",
                stateCode: "CO",
                zipcode: "12321",
                phone: "6665554444",
                status: "Pending",
                amount: "99.99",
            },
        });
    });

    it("gives bad request with invalid input", async () => {
        const resp = await request(app)
            .post(`/orders/order/${testOrderIds[0]}/info`)
            .send({
                email: 9599,
            });
        expect(resp.statusCode).toBe(400);
    });
});

/******************* GET /orders/order:orderId */

describe("GET, /orders/order:orderId", () => {
    it("gets an order by id", async () => {
        const resp = await request(app)
            .get(`/orders/order/${testOrderIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[0],
                email: "Pending",
                name: "Pending",
                street: "Pending",
                unit: "Pending",
                city: "Pending",
                stateCode: "Pending",
                zipcode: "Pending",
                phone: "Pending",
                transactionId: "Pending",
                status: "Pending",
                amount: "0",
                listItems: [],
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).get("/orders/order/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .get(`/orders/order/${-1}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(404);
    });
});

/******************************** GET /orders/ */

describe("GET, /orders/", () => {
    it("gets a list of all orders", async () => {
        const resp = await request(app)
            .get("/orders/")
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body.orders).toEqual([
            {
                id: testOrderIds[0],
                email: "Pending",
                name: "Pending",
                street: "Pending",
                unit: "Pending",
                city: "Pending",
                stateCode: "Pending",
                zipcode: "Pending",
                phone: "Pending",
                transactionId: "Pending",
                status: "Pending",
                amount: "0",
            },
            {
                id: testOrderIds[1],
                email: "Pending",
                name: "Pending",
                street: "Pending",
                unit: "Pending",
                city: "Pending",
                stateCode: "Pending",
                zipcode: "Pending",
                phone: "Pending",
                transactionId: "Pending",
                status: "Pending",
                amount: "0",
            },
        ]);
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).get("/orders/");
        expect(resp.statusCode).toBe(401);
    });
});

/*********** PATCH /orders/order/:orderId/confirm */

describe("PATCH, /orders/order/:orderId/confirm", () => {
    it("updates an order's status to 'Confirmed' by id", async () => {
        const resp = await request(app)
            .patch(`/orders/order/${testOrderIds[0]}/confirm`)
            .send({ transactionId: "abcd1234" })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[0],
                email: "Pending",
                name: "Pending",
                street: "Pending",
                unit: "Pending",
                city: "Pending",
                stateCode: "Pending",
                zipcode: "Pending",
                phone: "Pending",
                transactionId: "abcd1234",
                status: "Confirmed",
                amount: "0",
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/orders/order/1/confirm");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .patch(`/orders/order/${-1}/confirm`)
            .send({ transactionId: "nope" })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(404);
    });
});

/*********** PATCH /orders/order/:orderId/ship */

describe("PATCH, /orders/order/:orderId/ship", () => {
    it("updates an order's status to 'Shipped' by id", async () => {
        const resp = await request(app)
            .patch(`/orders/order/${testOrderIds[1]}/ship`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[1],
                email: "Pending",
                name: "Pending",
                street: "Pending",
                unit: "Pending",
                city: "Pending",
                stateCode: "Pending",
                zipcode: "Pending",
                phone: "Pending",
                transactionId: "Pending",
                status: "Shipped",
                amount: "0",
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/orders/order/1/ship");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .patch(`/orders/order/${-1}/ship`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(404);
    });
});

/******* PATCH /orders/order/:orderId/complete */

describe("PATCH, /orders/order/:orderId/complete", () => {
    it("updates an order's status to 'Completed' by id", async () => {
        const resp = await request(app)
            .patch(`/orders/order/${testOrderIds[1]}/complete`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            order: {
                id: testOrderIds[1],
                email: "Pending",
                name: "Pending",
                street: "Pending",
                unit: "Pending",
                city: "Pending",
                stateCode: "Pending",
                zipcode: "Pending",
                phone: "Pending",
                transactionId: "Pending",
                status: "Completed",
                amount: "0",
            },
        });
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).patch("/orders/order/1/complete");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .patch(`/orders/order/${-1}/complete`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(404);
    });
});

/********* DELETE /orders/order/:orderId/abort */

describe("DELETE, /orders/order:orderId", () => {
    it("deletes an order by id", async () => {
        await Order.addItem(testOrderIds[0], testItemIds[0]);
        await Order.addItem(testOrderIds[0], testItemIds[1]);

        const resp = await request(app).delete(
            `/orders/order/${testOrderIds[0]}/abort`
        );
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: {
                msg: "Aborted.",
            },
        });

        const checkResp = await request(app)
            .get(`/orders/order/${testOrderIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(checkResp.statusCode).toEqual(404);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app).delete(`/orders/order/${-1}/abort`);
        expect(resp.statusCode).toBe(404);
    });
});

/*************** DELETE /orders/order/:orderId */

describe("DELETE, /orders/order/:orderId", () => {
    it("deletes an order by id", async () => {
        const resp = await request(app)
            .delete(`/orders/order/${testOrderIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: {
                msg: "Removed.",
            },
        });

        const checkResp = await request(app)
            .get(`/orders/order/${testOrderIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(checkResp.statusCode).toEqual(404);
    });

    it("gives unauth for non-admin", async () => {
        const resp = await request(app).delete("/orders/order/1");
        expect(resp.statusCode).toBe(401);
    });

    it("gives not found for invalid id", async () => {
        const resp = await request(app)
            .delete(`/orders/order/${-1}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toBe(404);
    });
});

/************************ calculateOrderAmount */

describe("calculateOrderAmount", () => {
    it("calculates total amount from listItems", () => {
        const listItems = [
            {
                price: "42.99",
                shipping: "10.00",
            },
            {
                price: "66.00",
                shipping: "8.00",
            },
            {
                price: "4284.51",
                shipping: "20.00",
            },
        ];
        const total = calculateOrderAmount(listItems);
        expect(total).toBe(4431.5);
    });
});
