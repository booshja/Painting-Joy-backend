const { NotFoundError, BadRequestError } = require("../../expressError");
const db = require("../../db.js");
const Mural = require("../mural");

const testMuralIds = [];

beforeAll(async function () {
    await db.query("DELETE FROM murals");

    const results = await db.query(
        `INSERT INTO murals(title, description, price)
        VALUES ('Test Mural 1', 'This is test mural #1!', 12.99),
                ('Test Mural 2', 'This is test mural #2!', 24.99),
                ('Test Mural 3', 'This is test mural #3!', 36.99)
        RETURNING id`
    );
    testMuralIds.splice(0, 0, ...results.rows.map((row) => row.id));
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
    let newMural = {
        title: "Test Create Mural",
        description: "This is a test mural from the create method!",
        price: 99.99,
    };

    it("creates a new mural", async () => {
        let mural = await Mural.create(newMural);
        expect(mural).toEqual({
            id: expect.any(Number),
            title: "Test Create Mural",
            description: "This is a test mural from the create method!",
            price: "99.99",
            isArchived: false,
        });
    });
});

/************************************ addImage */

/************************************** getAll */

describe("getAll", () => {
    it("gets all the murals", async () => {
        let murals = await Mural.getAll();
        expect(murals).toEqual([
            {
                id: testMuralIds[0],
                title: "Test Mural 1",
                description: "This is test mural #1!",
                price: "12.99",
            },
            {
                id: testMuralIds[1],
                title: "Test Mural 2",
                description: "This is test mural #2!",
                price: "24.99",
            },
            {
                id: testMuralIds[2],
                title: "Test Mural 3",
                description: "This is test mural #3!",
                price: "36.99",
            },
        ]);
    });
});

/***************************************** get */

describe("get", () => {
    it("gets mural by id", async () => {
        let mural = await Mural.get(testMuralIds[0]);
        expect(mural).toEqual({
            id: testMuralIds[0],
            title: "Test Mural 1",
            description: "This is test mural #1!",
            price: "12.99",
        });
    });

    it("throws NotFoundError if no such mural", async () => {
        try {
            await Mural.get(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", () => {
    let updateData = {
        title: "Updated",
        description: "This mural was updated!",
        price: 1000.99,
    };

    it("updates mural", async () => {
        let mural = await Mural.update(testMuralIds[0], updateData);
        expect(mural).toEqual({
            id: testMuralIds[0],
            title: "Updated",
            description: "This mural was updated!",
            price: "1000.99",
        });
    });

    it("throws NotFoundError if no such mural", async () => {
        try {
            await Mural.update(0, { title: "Not gonna happen!" });
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    it("throws BadRequestError if no data", async () => {
        try {
            await Mural.update(testMuralIds[0], {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", () => {
    it("removes mural", async () => {
        const result = await Mural.remove(testMuralIds[0]);
        expect(result).toEqual({ msg: "Deleted." });

        const res = await db.query(`SELECT id FROM murals WHERE id=$1`, [
            testMuralIds[0],
        ]);
        expect(res.rows.length).toEqual(0);
    });

    it("throws NotFoundError if no such mural", async () => {
        try {
            await Mural.remove(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});