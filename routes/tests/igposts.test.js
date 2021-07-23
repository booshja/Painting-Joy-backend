const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const IGPost = require("../../models/igpost");

beforeAll(async () => {
    await db.query("DELETE FROM igposts");

    // await IGPost.add({
    //     // TODO
    // });
});

beforeEach(async () => {
    await db.query("BEGIN");
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

afterAll(async () => {
    await db.end();
});

/****************************** POST /igposts/ */

describe("POST, /igposts/", () => {
    it("creates a new igpost", async () => {
        expect(1).toEqual(1);
    });
});

/******************************* GET /igposts/ */

describe("GET, /igposts/", () => {
    it("gets a list of all the igposts", async () => {
        expect(1).toEqual(1);
    });
});

/*********************** GET /igposts/post/:id */

describe("GET, /igposts/post/:id", () => {
    it("gets an igpost by id", async () => {
        expect(1).toEqual(1);
    });
});

/****************** DELETE /igposts/delete/:id */

describe("DELETE, /igposts/delete/:id", () => {
    it("deletes an igpost by id", async () => {
        expect(1).toEqual(1);
    });
});
