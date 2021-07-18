const { NotFoundError, BadRequestError } = require("../../expressError");
const db = require("../../db");
const Order = require("../order");

const testOrderIds = [];

beforeAll(async function () {
    await db.query("DELETE FROM orders");

    const results = await db.query(
        `INSERT INTO orders(email,
                            cust_name,
                            street,
                            unit,
                            city,
                            state_code,
                            zipcode,
                            phone_number,
                            transaction_id,
                            status,
                            amount)
            VALUES ('1@email.com', 'Tester1', '123 Main St', 'Apt 1', 'Seattle', 'WA', '99999', '5555555555', 'abcd1234', 'Confirmed', 1299.99),
                    ('2@email.com', 'Tester2', '456 State St', null, 'Boston', 'MA', '88888', '6666666666', 'efgh5678', 'Shipped', 2499.99),
                    ('3@email.com', 'Tester3', '789 University St', 'Unit 3420', 'Austin', 'TX', '77777', '7777777777', 'ijkl1234', 'Completed', 3699.99)
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
