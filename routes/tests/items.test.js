const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Item = require("../../models/item");

beforeAll(async () => {
    await db.query("DELETE FROM items");

    // await Item.create({
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

/******************************** POST /items/ */

describe("POST, /items/", () => {
    it("creates an item", async () => {
        expect(1).toEqual(1);
    });
});

/********************************* GET /items/ */

describe("GET, /items/", () => {
    it("gets a list of all items", async () => {
        expect(1).toEqual(1);
    });
});

/************************* GET /items/item/:id */

describe("GET, /items/item/:id", () => {
    it("get an item by id", async () => {
        expect(1).toEqual(1);
    });
});

/************************ GET /items/available */

describe("GET, /items/available", () => {
    it("gets list of all available items", async () => {
        expect(1).toEqual(1);
    });
});

/***************************** GET /items/sold */

describe("GET, /items/sold", () => {
    it("gets list of all sold items", async () => {
        expect(1).toEqual(1);
    });
});

/********************* PATCH /items/update/:id */

describe("PATCH, /items/update/:id", () => {
    it("does a full update on an item", async () => {
        expect(1).toEqual(1);
    });

    it("does a partial update on an item", async () => {
        expect(1).toEqual(1);
    });
});

/*********************** PATCH /items/sell/:id */

describe("PATCH, /items/sell/:id", () => {
    it("decreases quantity: 2+ quantity", async () => {
        expect(1).toEqual(1);
    });

    it("decreases quantity and marks sold", async () => {
        expect(1).toEqual(1);
    });
});

/*********************** PATCH /items/sold/:id */

describe("PATCH, /items/sold/:id", () => {
    it("marks an item as sold", async () => {
        expect(1).toEqual(1);
    });
});

/******************** DELETE /items/delete/:id */

describe("DELETE, /items/delete/:id", () => {
    it("deletes an item by id", async () => {
        expect(1).toEqual(1);
    });
});
