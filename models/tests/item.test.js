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

// describe("create", () => {
//     it("creates a new item", () => {

//     });
// });

/***************************************** get */

// describe("get", () => {
//     it("gets an item by id", () => {

//     });
// });

/************************************** getAll */

// describe("getAll", () => {
//     it("gets an array of all items", () => {

//     });
// });

/******************************** getAllActive */

// describe("getAllActive", () => {
//     it("gets an array of all active items", () => {

//     });
// });

/***************************** getAllAvailable */

// describe("getAllAvailable", () => {
//     it("", () => {

//     });
// });

/********************************** getAllSold */

// describe("getAllSold", () => {
//     it("", () => {

//     });
// });

/************************************** update */

// describe("update", () => {
//     it("", () => {

//     });
// });

/************************************** delete */

// describe("delete", () => {
//     it("", () => {

//     });
// });
