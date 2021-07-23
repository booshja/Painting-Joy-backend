const db = require("../../db");
const { BadRequestError, NotFoundError } = require("../../expressError");
const IGPost = require("../igpost");

const testIgpostIds = [];

beforeAll(async function () {
    await db.query("DELETE FROM igposts");

    const results = await db.query(
        `INSERT INTO igposts( ig_id, caption, perm_url, image_url)
            VALUES ('vaea23ceaaf9asfe87g6', 'Such a great post!', 'just-a-test.com', 'imageurl.com/image.jpg'),
                ('vaeaasdf97865g6', 'Such a great post again!', 'just-another-test.com', 'imageurl.com/image.png'),
                ('vae2345c546g6', 'Such a wonderful post!', 'just-a-third-test.com', 'imageurl.org/image.txt')
            RETURNING ig_id AS "igId"`
    );
    testIgpostIds.splice(0, 0, ...results.rows.map((row) => row.igId));
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

/***************************************** add */

describe("add", () => {
    let newPost = {
        igId: "testtesttest",
        caption: "this is a test",
        permUrl: "www.test.com",
        imageUrl: "www.test.com/image.jpg",
    };

    it("adds post", async () => {
        let post = await IGPost.add(newPost);
        expect(post).toEqual(newPost);
    });

    it("throws BadRequestError if no data", async () => {
        try {
            await IGPost.add({});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError if missing data", async () => {
        try {
            await IGPost.add({
                caption: "this is a test",
                permUrl: "www.test.com",
                imageUrl: "www.test.com/image.jpg",
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/***************************************** get */

describe("get", () => {
    it("gets post by igId", async () => {
        let post = await IGPost.get(testIgpostIds[0]);
        expect(post).toEqual({
            igId: testIgpostIds[0],
            caption: "Such a great post!",
            permUrl: "just-a-test.com",
            imageUrl: "imageurl.com/image.jpg",
        });
    });

    it("throws NotFoundError if not found", async () => {
        try {
            await IGPost.get("no");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    it("throws BadRequestError if no igId", async () => {
        try {
            await IGPost.get();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** getAll */

describe("getAll", () => {
    it("gets all posts", async () => {
        let post = await IGPost.getAll();
        expect(post).toEqual([
            {
                igId: testIgpostIds[0],
                caption: "Such a great post!",
                permUrl: "just-a-test.com",
                imageUrl: "imageurl.com/image.jpg",
            },
            {
                igId: testIgpostIds[1],
                caption: "Such a great post again!",
                permUrl: "just-another-test.com",
                imageUrl: "imageurl.com/image.png",
            },
            {
                igId: testIgpostIds[2],
                caption: "Such a wonderful post!",
                permUrl: "just-a-third-test.com",
                imageUrl: "imageurl.org/image.txt",
            },
        ]);
    });
});

/************************************** remove */

describe("delete", () => {
    it("deletes post", async () => {
        const result = await IGPost.delete(testIgpostIds[0]);
        expect(result).toEqual({ msg: "Deleted." });

        const res = await db.query(
            `SELECT ig_id AS "igId" FROM igposts WHERE ig_id=$1`,
            [testIgpostIds[0]]
        );
        expect(res.rows.length).toEqual(0);
    });

    it("throws BadRequestError if no input", async () => {
        try {
            await IGPost.delete();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws NotFoundError if no such post", async () => {
        try {
            await IGPost.delete(-1);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
