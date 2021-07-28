const { NotFoundError, BadRequestError } = require("../../expressError");
const db = require("../../db");
const Order = require("../order");

const testOrderIds = [];
const testItemIds = [];

beforeAll(async function () {
    await db.query("DELETE FROM orders");

    const results = await db.query(
        `INSERT INTO orders(email,
                            name,
                            street,
                            unit,
                            city,
                            state_code,
                            zipcode,
                            phone,
                            transaction_id,
                            status,
                            amount)
            VALUES (pgp_sym_encrypt('1@email.com', $1),
                        pgp_sym_encrypt('Tester1', $1),
                        pgp_sym_encrypt('123 Main St', $1),
                        pgp_sym_encrypt('Apt 1', $1),
                        pgp_sym_encrypt('Seattle', $1),
                        pgp_sym_encrypt('WA', $1),
                        pgp_sym_encrypt('99999', $1),
                        pgp_sym_encrypt('5555555555', $1),
                        pgp_sym_encrypt('abcd1234', $1),
                        'Confirmed',
                        1299.99),
                    (pgp_sym_encrypt('2@email.com', $1),
                        pgp_sym_encrypt('Tester2', $1),
                        pgp_sym_encrypt('456 State St', $1),
                        pgp_sym_encrypt(null, $1),
                        pgp_sym_encrypt('Boston', $1),
                        pgp_sym_encrypt('MA', $1),
                        pgp_sym_encrypt('88888', $1),
                        pgp_sym_encrypt('6666666666', $1),
                        pgp_sym_encrypt('efgh5678', $1),
                        'Shipped',
                        2499.99),
                    (pgp_sym_encrypt('3@email.com', $1),
                        pgp_sym_encrypt('Tester3', $1),
                        pgp_sym_encrypt('789 University St', $1),
                        pgp_sym_encrypt('Unit 3420', $1),
                        pgp_sym_encrypt('Austin', $1),
                        pgp_sym_encrypt('TX', $1),
                        pgp_sym_encrypt('77777', $1),
                        pgp_sym_encrypt('7777777777', $1),
                        pgp_sym_encrypt('ijkl1234', $1),
                        'Completed',
                        3699.99)
            RETURNING id`,
        [process.env.KEY]
    );
    testOrderIds.splice(0, 0, ...results.rows.map((row) => row.id));

    await db.query("DELETE FROM items");

    const itemsRes = await db.query(
        `INSERT INTO items(name,
                            description,
                            price,
                            shipping,
                            quantity)
            VALUES ('Item1', 'This is item 1.', 10.99, 1.99, 1),
                    ('Item2', 'This is item 2.', 20.99, 2.99, 2),
                    ('Item3', 'This is item 3.', 30.99, 3.99, 3),
                    ('Item4', 'This is item 4.', 40.99, 4.99, 4)
            RETURNING id`
    );
    testItemIds.splice(0, 0, ...itemsRes.rows.map((row) => row.id));

    await db.query("DELETE FROM orders_items");

    await db.query(
        `INSERT INTO orders_items(order_id, item_id)
            VALUES (${testOrderIds[0]},${testItemIds[0]}),
                    (${testOrderIds[0]}, ${testItemIds[3]}),
                    (${testOrderIds[1]}, ${testItemIds[0]}),
                    (${testOrderIds[1]}, ${testItemIds[1]}),
                    (${testOrderIds[1]}, ${testItemIds[3]}),
                    (${testOrderIds[2]}, ${testItemIds[0]}),
                    (${testOrderIds[2]}, ${testItemIds[1]}),
                    (${testOrderIds[2]}, ${testItemIds[2]}),
                    (${testOrderIds[2]}, ${testItemIds[3]})`
    );
});

beforeEach(async function () {
    await db.query("BEGIN");
});

afterEach(async function () {
    await db.query("ROLLBACK");
});

afterAll(async function () {
    await db.end();
});

/************************************** create */

describe("create", () => {
    it("creates a new order", async () => {
        const order = await Order.create();
        expect(order).toEqual({
            id: expect.any(Number),
            status: "Pending",
        });
    });
});

/************************************* addInfo */

describe("addInfo", () => {
    it("adds customer data to order by id", async () => {
        const order = await Order.addInfo(testOrderIds[0], {
            email: "jack@email.com",
            name: "Jackary Johansson",
            street: "456 Main Ave.",
            unit: "Apt. 99",
            city: "Seattle",
            stateCode: "WA",
            zipcode: 98789,
            phone: 2065559999,
            amount: 45653.99,
        });
        expect(order).toEqual({
            id: testOrderIds[0],
            email: "jack@email.com",
            name: "Jackary Johansson",
            street: "456 Main Ave.",
            unit: "Apt. 99",
            city: "Seattle",
            stateCode: "WA",
            zipcode: "98789",
            phone: "2065559999",
            status: "Confirmed",
            amount: "45653.99",
        });
    });

    it("throws BadRequestError if no input", async () => {
        try {
            await Order.addInfo();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if invalid order id", async () => {
        try {
            await Order.addInfo(-1, {
                email: "xx",
                name: "xx",
                street: "xx",
                unit: "xx",
                city: "xx",
                stateCode: "xx",
                zipcode: 98789,
                phone: 2065559999,
                amount: 1000000,
            });
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************* addItem */

describe("addItem", () => {
    it("add the item to the order", async () => {
        const added = await Order.addItem(testOrderIds[0], testItemIds[0]);
        expect(added).toEqual({ msg: "Added." });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Order.addItem();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing id", async () => {
        try {
            await Order.addItem(-1);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.addItem(-1, -1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    it("throws NotFoundError if item not found", async () => {
        try {
            await Order.addItem(testOrderIds[0], -1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/***************************************** get */

describe("get", () => {
    it("gets an order by id", async () => {
        const order = await Order.get(testOrderIds[0]);
        expect(order).toEqual({
            id: testOrderIds[0],
            email: "1@email.com",
            name: "Tester1",
            street: "123 Main St",
            unit: "Apt 1",
            city: "Seattle",
            stateCode: "WA",
            zipcode: "99999",
            phone: "5555555555",
            transactionId: "abcd1234",
            status: "Confirmed",
            amount: "1299.99",
            listItems: [
                {
                    id: testItemIds[0],
                    name: "Item1",
                    description: "This is item 1.",
                    price: "10.99",
                    shipping: "1.99",
                    quantity: 1,
                },
                {
                    id: testItemIds[3],
                    name: "Item4",
                    description: "This is item 4.",
                    price: "40.99",
                    shipping: "4.99",
                    quantity: 4,
                },
            ],
        });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Order.get();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.get(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** getAll */

describe("getAll", () => {
    it("gets all orders", async () => {
        const orders = await Order.getAll();
        expect(orders).toEqual([
            {
                id: testOrderIds[0],
                email: "1@email.com",
                name: "Tester1",
                street: "123 Main St",
                unit: "Apt 1",
                city: "Seattle",
                stateCode: "WA",
                zipcode: "99999",
                phone: "5555555555",
                transactionId: "abcd1234",
                status: "Confirmed",
                amount: "1299.99",
            },
            {
                id: testOrderIds[1],
                email: "2@email.com",
                name: "Tester2",
                street: "456 State St",
                unit: null,
                city: "Boston",
                stateCode: "MA",
                zipcode: "88888",
                phone: "6666666666",
                transactionId: "efgh5678",
                status: "Shipped",
                amount: "2499.99",
            },
            {
                id: testOrderIds[2],
                email: "3@email.com",
                name: "Tester3",
                street: "789 University St",
                unit: "Unit 3420",
                city: "Austin",
                stateCode: "TX",
                zipcode: "77777",
                phone: "7777777777",
                transactionId: "ijkl1234",
                status: "Completed",
                amount: "3699.99",
            },
        ]);
    });
});

/******************************* markConfirmed */

describe("markConfirmed", () => {
    it("updates order status to confirmed", async () => {
        const order = await Order.markConfirmed(testOrderIds[0], "1234abcd");
        expect(order).toEqual({
            id: testOrderIds[0],
            email: "1@email.com",
            name: "Tester1",
            street: "123 Main St",
            unit: "Apt 1",
            city: "Seattle",
            stateCode: "WA",
            zipcode: "99999",
            phone: "5555555555",
            transactionId: "1234abcd",
            status: "Confirmed",
            amount: "1299.99",
        });
    });

    it("throws BadRequestError if no input", async () => {
        try {
            await Order.markConfirmed();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.markConfirmed(-1, "abc");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/********************************* markShipped */

describe("markShipped", () => {
    it("updates order status to shipped", async () => {
        const order = await Order.markShipped(testOrderIds[0]);
        expect(order).toEqual({
            id: testOrderIds[0],
            email: "1@email.com",
            name: "Tester1",
            street: "123 Main St",
            unit: "Apt 1",
            city: "Seattle",
            stateCode: "WA",
            zipcode: "99999",
            phone: "5555555555",
            transactionId: "abcd1234",
            status: "Shipped",
            amount: "1299.99",
        });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Order.markShipped();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.markShipped(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/******************************* markCompleted */

describe("markCompleted", () => {
    it("updates order status to completed", async () => {
        const order = await Order.markCompleted(testOrderIds[0]);
        expect(order).toEqual({
            id: testOrderIds[0],
            email: "1@email.com",
            name: "Tester1",
            street: "123 Main St",
            unit: "Apt 1",
            city: "Seattle",
            stateCode: "WA",
            zipcode: "99999",
            phone: "5555555555",
            transactionId: "abcd1234",
            status: "Completed",
            amount: "1299.99",
        });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Order.markCompleted();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.markCompleted(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** removeItem */

describe("removeItem", () => {
    it("removes item from order by order_id and item_id", async () => {
        const removed = await Order.removeItem(testOrderIds[1], testItemIds[0]);
        expect(removed).toEqual({
            msg: "Item removed.",
        });

        const res = await db.query(
            `SELECT id
                FROM orders_items
                WHERE order_id=$1`,
            [testOrderIds[1]]
        );
        expect(res.rows.length).toEqual(2);
    });

    it("throws BadRequestError if no ids", async () => {
        try {
            await Order.removeItem();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing id", async () => {
        try {
            await Order.removeItem(12);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.removeItem(-1, 12);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    it("throws NotFoundError if item not found", async () => {
        try {
            await Order.removeItem(testOrderIds[1], -1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    it("throws NotFoundError if association not found", async () => {
        try {
            await Order.removeItem(testOrderIds[1], testItemIds[2]);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", () => {
    it("removes order by id", async () => {
        const removed = await Order.remove(testOrderIds[0]);
        expect(removed).toEqual({ msg: "Removed." });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Order.remove();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.remove(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** delete */

describe("delete", () => {
    it("deletes order by id", async () => {
        const deleted = await Order.delete(testOrderIds[1]);
        expect(deleted).toEqual({ msg: "Aborted." });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Order.delete();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.delete(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
