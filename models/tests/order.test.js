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
            email: "99@email.com",
            name: "Tester99",
            street: "99 Main St",
            unit: "Apt 99",
            city: "Seattle",
            state_code: "WA",
            zipcode: 98789,
            phone: 1111111111,
            transaction_id: "1234abcd",
            status: "Confirmed",
            amount: 9999.99,
        };

        const order = await Order.create(newOrder);
        expect(order).toEqual({
            id: expect.any(Number),
            email: "99@email.com",
            name: "Tester99",
            street: "99 Main St",
            unit: "Apt 99",
            city: "Seattle",
            state_code: "WA",
            zipcode: 98789,
            phone: "1111111111",
            transaction_id: "1234abcd",
            status: "Confirmed",
            amount: "9999.99",
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
            state_code: "WA",
            zipcode: 99999,
            phone: "5555555555",
            transaction_id: "abcd1234",
            status: "Confirmed",
            amount: "1299.99",
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
                state_code: "WA",
                zipcode: 99999,
                phone: "5555555555",
                transaction_id: "abcd1234",
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
                state_code: "MA",
                zipcode: 88888,
                phone: "6666666666",
                transaction_id: "efgh5678",
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
                state_code: "TX",
                zipcode: 77777,
                phone: "7777777777",
                transaction_id: "ijkl1234",
                status: "Completed",
                amount: "3699.99",
            },
        ]);
    });
});

/************************************ getEmail */

describe("getEmail", () => {
    it("returns the email attached to the order by id", async () => {
        const email = await Order.getEmail(testOrderIds[0]);
        expect(email).toEqual({ email: "1@email.com" });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Order.getEmail();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Order.getEmail(-1);
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
            state_code: "WA",
            zipcode: 99999,
            phone: "5555555555",
            transaction_id: "abcd1234",
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

// describe("markCompleted", () => {
//     it("updates order status to completed", async () => {
//         const order = await Order.markCompleted(testOrderIds[0]);
//         expect(order).toEqual({
//             id: testOrderIds[0],
//             email: "1@email.com",
//             name: "Tester1",
//             street: "123 Main St",
//             unit: "Apt 1",
//             city: "Seattle",
//             state_code: "WA",
//             zipcode: 99999,
//             phone: "5555555555",
//             transaction_id: "abcd1234",
//             status: "Completed",
//             amount: "1299.99",
//         });
//     });

//     it("throws BadRequestError if no id", async () => {
//         try {
//             await Order.markCompleted();
//             fail();
//         } catch (err) {
//             expect(err instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     it("throws NotFoundError if order not found", async () => {
//         try {
//             await Order.markCompleted(-1);
//             fail();
//         } catch (err) {
//             expect(err instanceof NotFoundError).toBeTruthy();
//         }
//     });
// });

// /************************************** remove */

// describe("remove", () => {
//     it("removes order by id", async () => {
//         const removed = await Order.remove(testOrderIds[0]);
//         expect(removed).toEqual({ msg: "Removed." });
//     });

//     it("throws BadRequestError if no id", async () => {
//         try {
//             await Order.remove();
//             fail();
//         } catch (err) {
//             expect(err instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     it("throws NotFoundError if order not found", async () => {
//         try {
//             await Order.remove(-1);
//             fail();
//         } catch (err) {
//             expect(err instanceof NotFoundError).toBeTruthy();
//         }
//     });
// });
