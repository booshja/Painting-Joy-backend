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
                            shipping,
                            quantity)
            VALUES ('Item1', 'This is a great item!', 99.99, 10.99, 1),
                ('Item2', 'This is a wonderful item!', 199.99, 20.99, 2),
                ('Item3', 'This is a fantastic item!', 299.99, 20.99, 3)
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
        shipping: 4.99,
        quantity: 6,
    };

    it("creates a new item", async () => {
        const item = await Item.create(newItem);
        expect(item).toEqual({
            id: expect.any(Number),
            name: "Lowbrow",
            description: "Look at this item! Buy it!",
            price: "27.89",
            shipping: "4.99",
            quantity: 6,
            created: expect.any(Date),
            isSold: false,
        });
    });

    it("throws BadRequestError if no data", async () => {
        try {
            await Item.create();
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
            shipping: "10.99",
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
                shipping: "10.99",
                quantity: 1,
                created: expect.any(Date),
                isSold: false,
            },
            {
                id: expect.any(Number),
                name: "Item2",
                description: "This is a wonderful item!",
                price: "199.99",
                shipping: "20.99",
                quantity: 2,
                created: expect.any(Date),
                isSold: false,
            },
            {
                id: expect.any(Number),
                name: "Item3",
                description: "This is a fantastic item!",
                price: "299.99",
                shipping: "20.99",
                quantity: 3,
                created: expect.any(Date),
                isSold: false,
            },
        ]);
    });
});

/***************************** getAllAvailable */

describe("getAllAvailable", () => {
    it("gets an array of all NOT sold items", async () => {
        await db.query(
            `INSERT INTO items(name,
                            description,
                            price,
                            shipping,
                            quantity,
                            is_sold)
                VALUES('Item4', 'This is so great I bought it!', 399.99, 100.99, 1, true)`
        );

        const items = await Item.getAllAvailable();
        expect(items).toEqual([
            {
                id: expect.any(Number),
                name: "Item1",
                description: "This is a great item!",
                price: "99.99",
                shipping: "10.99",
                quantity: 1,
                created: expect.any(Date),
            },
            {
                id: expect.any(Number),
                name: "Item2",
                description: "This is a wonderful item!",
                price: "199.99",
                shipping: "20.99",
                quantity: 2,
                created: expect.any(Date),
            },
            {
                id: expect.any(Number),
                name: "Item3",
                description: "This is a fantastic item!",
                price: "299.99",
                shipping: "20.99",
                quantity: 3,
                created: expect.any(Date),
            },
        ]);

        const result = await db.query(`SELECT * FROM items`);
        expect(result.rows.length).toEqual(4);
    });
});

/********************************** getAllSold */

describe("getAllSold", () => {
    it("gets an array of all sold items", async () => {
        await db.query(
            `INSERT INTO items(name,
                            description,
                            price,
                            shipping,
                            quantity,
                            is_sold)
                VALUES('Item4', 'This is so great I bought it!', 399.99, 8.99, 1, true)`
        );

        const items = await Item.getAllSold();
        expect(items).toEqual([
            {
                id: expect.any(Number),
                name: "Item4",
                description: "This is so great I bought it!",
                price: "399.99",
                shipping: "8.99",
                quantity: 1,
                created: expect.any(Date),
            },
        ]);

        const result = await db.query(`SELECT * FROM items`);
        expect(result.rows.length).toEqual(4);
    });
});

/************************************** update */

describe("update", () => {
    it("does a full update on an item", async () => {
        const item = await Item.update(testItemIds[0], {
            name: "BEST THING EVER",
            description: "It's the best thing ever!",
            price: 1.99,
            shipping: 4.99,
            quantity: 987,
        });
        expect(item).toEqual({
            id: expect.any(Number),
            name: "BEST THING EVER",
            description: "It's the best thing ever!",
            price: "1.99",
            shipping: "4.99",
            quantity: 987,
            created: expect.any(Date),
            isSold: false,
        });
    });

    it("does a partial update on an item", async () => {
        const item = await Item.update(testItemIds[1], {
            quantity: 789,
        });
        expect(item).toEqual({
            id: expect.any(Number),
            name: "Item2",
            description: "This is a wonderful item!",
            price: "199.99",
            shipping: "20.99",
            quantity: 789,
            created: expect.any(Date),
            isSold: false,
        });
    });

    it("throws BadRequestError if no data", async () => {
        try {
            await Item.update();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing data", async () => {
        try {
            await Item.update(testItemIds[0]);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Item.update(-1, { name: "Best Painting Ever" });
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/**************************************** sell */

describe("sell", () => {
    it("decreases the quantity of an item with 2+ quantity", async () => {
        const decreased = await Item.sell(testItemIds[1]);
        expect(decreased).toEqual({
            id: testItemIds[1],
            name: "Item2",
            price: "199.99",
            shipping: "20.99",
            description: "This is a wonderful item!",
            quantity: 1,
            created: expect.any(Date),
            isSold: false,
        });
    });

    it("decreases quantity to 0 and changes isSold to true", async () => {
        const sellingOut = await Item.sell(testItemIds[0]);
        expect(sellingOut).toEqual({
            id: testItemIds[0],
            name: "Item1",
            price: "99.99",
            shipping: "10.99",
            description: "This is a great item!",
            quantity: 0,
            created: expect.any(Date),
            isSold: true,
        });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Item.sell();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if item not found", async () => {
        try {
            await Item.sell(-1);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    it("throws BadRequestError if item already sold out", async () => {
        const soldRes = await db.query(
            `INSERT INTO items (name,
                                description,
                                price,
                                shipping,
                                quantity,
                                is_sold)
                VALUES ('SoldOutItem',
                        'This item has none!',
                        1000.99,
                        8.99,
                        0,
                        true)
                RETURNING id`
        );
        const soldOut = soldRes.rows[0];

        try {
            await Item.sell(soldOut.id);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************ markSold */

describe("markSold", () => {
    it("marks item as sold by id", async () => {
        const item = await Item.markSold(testItemIds[2]);
        expect(item).toEqual({
            id: expect.any(Number),
            name: "Item3",
            description: "This is a fantastic item!",
            price: "299.99",
            shipping: "20.99",
            quantity: 0,
            created: expect.any(Date),
            isSold: true,
        });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Item.markSold();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Item.markSold(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** delete */

describe("delete", () => {
    it("deletes an item by id", async () => {
        const removed = await Item.delete(testItemIds[0]);
        expect(removed).toEqual({ msg: "Deleted." });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Item.delete();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if order not found", async () => {
        try {
            await Item.delete(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
