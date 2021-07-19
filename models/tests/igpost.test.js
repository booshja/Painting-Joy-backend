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
            RETURNING ig_id`
    );
    testIgpostIds.splice(0, 0, ...results.rows.map((row) => row.ig_id));
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
        ig_id: "testtesttest",
        caption: "this is a test",
        perm_url: "www.test.com",
        image_url: "www.test.com/image.jpg",
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
                perm_url: "www.test.com",
                image_url: "www.test.com/image.jpg",
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/***************************************** get */

describe("get", () => {
    it("gets post by ig_id", async () => {
        let post = await IGPost.get(testIgpostIds[0]);
        expect(post).toEqual({
            ig_id: testIgpostIds[0],
            caption: "Such a great post!",
            perm_url: "just-a-test.com",
            image_url: "imageurl.com/image.jpg",
        });
    });

    it("throws NotFoundError if not found", async () => {
        try {
            await IGPost.get("no");
            fail();
        } catch (err) {
            console.log(err);
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    it("throws BadRequestError if no ig_id", async () => {
        try {
            await IGPost.get();
            fail();
        } catch (err) {
            console.log(err);
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
                ig_id: testIgpostIds[0],
                caption: "Such a great post!",
                perm_url: "just-a-test.com",
                image_url: "imageurl.com/image.jpg",
            },
            {
                ig_id: testIgpostIds[1],
                caption: "Such a great post again!",
                perm_url: "just-another-test.com",
                image_url: "imageurl.com/image.png",
            },
            {
                ig_id: testIgpostIds[2],
                caption: "Such a wonderful post!",
                perm_url: "just-a-third-test.com",
                image_url: "imageurl.org/image.txt",
            },
        ]);
    });
});

/************************************** remove */

describe("delete", () => {
    it("deletes post", async () => {
        const result = await IGPost.delete(testIgpostIds[0]);
        expect(result).toEqual({ msg: "Deleted." });

        const res = await db.query(`SELECT ig_id FROM igposts WHERE ig_id=$1`, [
            testIgpostIds[0],
        ]);
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
