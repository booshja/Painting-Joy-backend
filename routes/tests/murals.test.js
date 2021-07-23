const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Mural = require("../../models/mural");

beforeAll(async () => {
    await db.query("DELETE FROM murals");

    // await Mural.create({
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

/******************************** POST /murals */

describe("POST, /murals", () => {
    it("creates new mural", async () => {
        expect(1).toEqual(1);
    });
});

/********************************* GET /murals */

describe("GET, /murals/", () => {
    it("returns a list of all murals", async () => {
        expect(1).toEqual(1);
    });
});

/********************************* GET /murals */

describe("GET, /murals/:id", () => {
    it("returns a single mural by id", async () => {
        expect(1).toEqual(1);
    });
});

/******************************* PATCH /murals */

describe("PATCH, /murals/:id", () => {
    it("does a full update on a mural by id", async () => {
        expect(1).toEqual(1);
    });

    it("does a partial update on a mural by id", async () => {
        expect(1).toEqual(1);
    });
});

/****************************** DELETE /murals */

describe("DELETE, /murals/:id", () => {
    it("deletes mural", async () => {
        expect(1).toEqual(1);
    });
});
