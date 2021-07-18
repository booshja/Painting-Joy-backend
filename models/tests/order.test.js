const { NotFoundError, BadRequestError } = require("../../expressError");
const db = require("../../db");
const Order = require("../order");

const testOrderIds = [];

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
            VALUES ('1@email.com', 'Tester1', '123 Main St', 'Apt 1', 'Seattle', 'WA', 99999, 5555555555, 'abcd1234', 'Confirmed', 1299.99),
                    ('2@email.com', 'Tester2', '456 State St', null, 'Boston', 'MA', 88888, 6666666666, 'efgh5678', 'Shipped', 2499.99),
                    ('3@email.com', 'Tester3', '789 University St', 'Unit 3420', 'Austin', 'TX', 77777, 7777777777, 'ijkl1234', 'Completed', 3699.99)
            RETURNING id`
    );
    testOrderIds.splice(0, 0, ...results.rows.map((row) => row.id));
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
        const newOrder = {
            email: "1@email.com",
            name: "Tester1",
            street: "123 Main St",
            unit: "Apt 1",
            city: "Seattle",
            state_code: "WA",
            zipcode: 99999,
            phone: 5555555555,
            transaction_id: "abcd1234",
            status: "Confirmed",
            amount: 1299.99,
        };

        const order = await Order.create(newOrder);
        expect(order).toEqual({
            id: expect.any(Number),
            email: "1@email.com",
            name: "Tester1",
            street: "123 Main St",
            unit: "Apt 1",
            city: "Seattle",
            state_code: "WA",
            zipcode: 99999,
            phone: "5555555555",
            transaction_id: "abcd1234",
            status: "Confirmed",
            amount: "1299.99",
        });
    });

    it("throws BadRequestError if no data", async () => {
        try {
            await Order.create({});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing data", async () => {
        try {
            await Order.create({
                email: "1@email.com",
                name: "Tester1",
                street: "123 Main St",
                unit: "Apt 1",
                city: "Seattle",
                state_code: "WA",
                zipcode: "99999",
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/***************************************** get */

// describe("get");

/************************************** getAll */

// describe("getAll");

/************************************ getEmail */

// describe("getEmail");

/********************************* markShipped */

// describe("markShipped");

/******************************* markCompleted */

// describe("markCompleted");

/************************************** remove */

// describe("remove");
