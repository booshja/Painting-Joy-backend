const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Item = require("../../models/item");
const Order = require("../../models/order");

beforeAll(async () => {
    await db.query("DELETE FROM orders");
    await db.query("DELETE FROM items");
    await db.query("DELETE FROM orders_items");

    // await Item.create({
    //     // TODO
    // });

    // await Order.create(
    //     {
    //         // TODO
    //     },
    //     []
    // );
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
    it("creates a new order", async () => {
        expect(1).toEqual(1);
    });
});

/*********** POST /orders/:orderId/add/:itemId */

describe("/orders/:orderId/add/:itemId", () => {
    it("adds an item to an order by orderId & itemId", async () => {
        expect(1).toEqual(1);
    });
});

/************************ GET /orders/:orderId */

describe("/orders/:orderId", () => {
    it("gets an order by id", async () => {
        expect(1).toEqual(1);
    });
});

/******************************** GET /orders/ */

describe("/orders/", () => {
    it("gets a list of all orders", async () => {
        expect(1).toEqual(1);
    });
});

/***************** PATCH /orders/:orderId/ship */

describe("/orders/:orderId/ship", () => {
    it("updates an order's status to 'Shipped' by id", async () => {
        expect(1).toEqual(1);
    });
});

/************* PATCH /orders/:orderId/complete */

describe("/orders/:orderId/complete", () => {
    it("updates an order's status to 'Completed' by id", async () => {
        expect(1).toEqual(1);
    });
});

/******* PATCH /orders/:orderId/remove/:itemId */

describe("/orders/:orderId/remove/:itemId", () => {
    it("removes an item from an order by orderId & itemId", async () => {
        expect(1).toEqual(1);
    });
});

/********************* DELETE /orders/:orderId */

describe("/orders/:orderId", () => {
    it("deltes an order by id", async () => {
        expect(1).toEqual(1);
    });
});
