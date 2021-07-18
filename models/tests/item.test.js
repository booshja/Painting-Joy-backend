const db = require("../../db");
const { BadRequestError, NotFoundError } = require("../../expressError");
const Item = require("../item");

const testItemIds = [];

beforeAll(async function () {
    await db.query("DELETE FROM items");

    const results = await db.query(
        `INSERT INTO items(name,
                            description,
                            price,
                            quantity)
            VALUES ('Item1', 'This is a great item!', 99.99, 1),
                ('Item2', 'This is a wonderful item!', 199.99, 2),
                ('Item3', 'This is a fantastic item!', 299.99, 3)
            RETURNING id`
    );
    testItemIds.splice(0, 0, ...results.rows.map((row) => row.id));
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
    const newItem = {
        name: "Lowbrow",
        description: "Look at this item! Buy it!",
        price: 27.89,
        quantity: 6,
    };

    it("creates a new item", async () => {
        const item = await Item.create(newItem);
        expect(item).toEqual({
            id: expect.any(Number),
            name: "Lowbrow",
            description: "Look at this item! Buy it!",
            price: "27.89",
            quantity: 6,
            created: expect.any(Date),
            is_sold: false,
        });
    });

    it("throws BadRequestError if no data", async () => {
        try {
            await Item.create({});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing data", async () => {
        try {
            await Item.create({
                name: "BadTest",
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/***************************************** get */

describe("get", () => {
    it("gets an item by id", async () => {
        const item = await Item.get(testItemIds[0]);
        expect(item).toEqual({
            id: expect.any(Number),
            name: "Item1",
            description: "This is a great item!",
            price: "99.99",
            quantity: 1,
            created: expect.any(Date),
            isSold: false,
        });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Item.get();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Item.get(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** getAll */

describe("getAll", () => {
    it("gets an array of all items", async () => {
        const items = await Item.getAll();
        expect(items).toEqual([
            {
                id: expect.any(Number),
                name: "Item1",
                description: "This is a great item!",
                price: "99.99",
                quantity: 1,
                created: expect.any(Date),
                isSold: false,
            },
            {
                id: expect.any(Number),
                name: "Item2",
                description: "This is a wonderful item!",
                price: "199.99",
                quantity: 2,
                created: expect.any(Date),
                isSold: false,
            },
            {
                id: expect.any(Number),
                name: "Item3",
                description: "This is a fantastic item!",
                price: "299.99",
                quantity: 3,
                created: expect.any(Date),
                isSold: false,
            },
        ]);
    });
});

/***************************** getAllAvailable */

describe("getAllAvailable", async () => {
    await db.query(
        `INSERT INTO items(name,
                        description,
                        price,
                        quantity,
                        is_sold)
            VALUES('Item4', 'This is so great I bought it!', 399.99, 1, true)`
    );

    it("gets an array of all NOT sold items", async () => {
        const items = await Item.getAllAvailable();
        expect(items).toEqual([
            {
                id: expect.any(Number),
                name: "Item1",
                description: "This is a great item!",
                price: "99.99",
                quantity: 1,
                created: expect.any(Date),
            },
            {
                id: expect.any(Number),
                name: "Item2",
                description: "This is a wonderful item!",
                price: "199.99",
                quantity: 2,
                created: expect.any(Date),
            },
            {
                id: expect.any(Number),
                name: "Item3",
                description: "This is a fantastic item!",
                price: "299.99",
                quantity: 3,
                created: expect.any(Date),
            },
        ]);

        const result = await db.query(`GET * FROM items`);
        expect(result.rows.length).toEqual(4);
    });
});

/********************************** getAllSold */

describe("getAllSold", async () => {
    await db.query(
        `INSERT INTO items(name,
                        description,
                        price,
                        quantity,
                        is_sold)
            VALUES('Item4', 'This is so great I bought it!', 399.99, 1, true)`
    );

    it("gets an array of all sold items", async () => {
        const items = await Item.getAllAvailable();
        expect(items).toEqual([
            {
                id: expect.any(Number),
                name: "Item4",
                description: "This is so great I bought it!!",
                price: "399.99",
                quantity: 1,
                created: expect.any(Date),
            },
        ]);

        const result = await db.query(`GET * FROM items`);
        expect(result.rows.length).toEqual(4);
    });
});

/************************************** update */

// describe("update", () => {
//     it("does a full update on an item", async () => {

//     });
// });

/************************************** delete */

// describe("delete", () => {
//     it("deletes an item", async () => {

//     });
// });
