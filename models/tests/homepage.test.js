const { BadRequestError } = require("../../expressError");
const db = require("../../db");
const Homepage = require("../homepage");

beforeAll(async function () {
    await db.query("DELETE FROM homepages");
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

/************************************* getData */

describe("getData", () => {
    it("gets homepage data", async () => {
        await db.query(
            `INSERT INTO homepages (greeting, message)
            VALUES ($1, $2)`,
            ["Hi! This is my page!", "This is a test message!"]
        );

        let homepage = await Homepage.getData();
        expect(homepage).toEqual({
            id: expect.any(Number),
            greeting: "Hi! This is my page!",
            message: "This is a test message!",
        });
    });
});

/************************************** update */

describe("update", () => {
    it("updates with new data", async () => {
        let newHomepage = {
            greeting: "Hi! This is my page!",
            message: "This is a test message!",
        };

        let homepage = await Homepage.update(newHomepage);
        expect(homepage).toEqual({
            id: expect.any(Number),
            greeting: "Hi! This is my page!",
            message: "This is a test message!",
        });
    });

    it("throws BadRequestError if no data", async () => {
        try {
            await Homepage.update();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing data", async () => {
        try {
            await Homepage.update({
                greeting: "BadTest",
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});
