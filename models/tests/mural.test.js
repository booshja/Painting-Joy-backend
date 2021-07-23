const { NotFoundError, BadRequestError } = require("../../expressError");
const db = require("../../db.js");
const Mural = require("../mural");

const testMuralIds = [];

beforeAll(async function () {
    await db.query("DELETE FROM murals");

    const results = await db.query(
        `INSERT INTO murals(title, description)
        VALUES ('Test Mural 1', 'This is test mural #1!'),
                ('Test Mural 2', 'This is test mural #2!'),
                ('Test Mural 3', 'This is test mural #3!')
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
    };

    it("creates a new mural", async () => {
        let mural = await Mural.create(newMural);
        expect(mural).toEqual({
            id: expect.any(Number),
            title: "Test Create Mural",
            description: "This is a test mural from the create method!",
            isArchived: false,
        });
    });

    it("throws BadRequestError if no data", async () => {
        try {
            await Mural.create();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing data", async () => {
        try {
            await Mural.create({
                name: "Testerino",
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
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
            },
            {
                id: testMuralIds[1],
                title: "Test Mural 2",
                description: "This is test mural #2!",
            },
            {
                id: testMuralIds[2],
                title: "Test Mural 3",
                description: "This is test mural #3!",
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
        });
    });

    it("throws BadRequestError if no input", async () => {
        try {
            await Mural.get();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if no such mural", async () => {
        try {
            await Mural.get(-1);
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
    };

    it("updates mural", async () => {
        let mural = await Mural.update(testMuralIds[0], updateData);
        expect(mural).toEqual({
            id: testMuralIds[0],
            title: "Updated",
            description: "This mural was updated!",
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

    it("throws BadRequestError if no input", async () => {
        try {
            await Mural.remove();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if no such mural", async () => {
        try {
            await Mural.remove(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
