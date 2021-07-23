const { NotFoundError, BadRequestError } = require("../../expressError");
const db = require("../../db.js");
const Mural = require("../mural");

const testMuralIds = [];

beforeAll(async function () {
    await db.query("DELETE FROM murals");

    const results = await db.query(
        `INSERT INTO murals(title, description, is_archived)
        VALUES ('Test Mural 1', 'This is test mural #1!', false),
                ('Test Mural 2', 'This is test mural #2!', false),
                ('Test Mural 3', 'This is test mural #3!', false),
                ('Test Mural 4', 'This is test mural #4!', true)
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

/************************************** getAll */

describe("getAll", () => {
    it("gets all the murals", async () => {
        let murals = await Mural.getAll();
        expect(murals).toEqual([
            {
                id: testMuralIds[0],
                title: "Test Mural 1",
                description: "This is test mural #1!",
                isArchived: false,
            },
            {
                id: testMuralIds[1],
                title: "Test Mural 2",
                description: "This is test mural #2!",
                isArchived: false,
            },
            {
                id: testMuralIds[2],
                title: "Test Mural 3",
                description: "This is test mural #3!",
                isArchived: false,
            },
            {
                id: testMuralIds[3],
                title: "Test Mural 4",
                description: "This is test mural #4!",
                isArchived: true,
            },
        ]);
    });
});

/********************************* getArchived */

describe("getArchived", () => {
    it("gets all the archived murals", async () => {
        let murals = await Mural.getArchived();
        expect(murals).toEqual([
            {
                id: testMuralIds[3],
                title: "Test Mural 4",
                description: "This is test mural #4!",
            },
        ]);
    });
});

/*********************************** getActive */

describe("getActive", () => {
    it("gets all the non-archived murals", async () => {
        let murals = await Mural.getActive();
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
            await Mural.update(-1, { title: "Not gonna happen!" });
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    it("throws BadRequestError if no input", async () => {
        try {
            await Mural.update();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing input", async () => {
        try {
            await Mural.update(12);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************* archive */

describe("archive", () => {
    it("sets mural as archived by id", async () => {
        let mural = await Mural.archive(testMuralIds[2]);
        expect(mural).toEqual({
            id: testMuralIds[2],
            title: "Test Mural 3",
            description: "This is test mural #3!",
            isArchived: true,
        });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Mural.archive();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if invalid id", async () => {
        try {
            await Mural.archive(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/*********************************** unArchive */

describe("unArchive", () => {
    it("sets mural to active (not archived)", async () => {
        let mural = await Mural.unArchive(testMuralIds[2]);
        expect(mural).toEqual({
            id: testMuralIds[2],
            title: "Test Mural 3",
            description: "This is test mural #3!",
            isArchived: false,
        });
    });

    it("throws BadRequestError if no id", async () => {
        try {
            await Mural.unArchive();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if invalid id", async () => {
        try {
            await Mural.unArchive(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** delete */

describe("delete", () => {
    it("deletes mural", async () => {
        const result = await Mural.delete(testMuralIds[0]);
        expect(result).toEqual({ msg: "Deleted." });

        const res = await db.query(`SELECT id FROM murals WHERE id=$1`, [
            testMuralIds[0],
        ]);
        expect(res.rows.length).toEqual(0);
    });

    it("throws BadRequestError if no input", async () => {
        try {
            await Mural.delete();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if no such mural", async () => {
        try {
            await Mural.delete(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
