const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Item = require("../../models/item");

beforeAll(async () => {
    await db.query("DELETE FROM items");

    await Item.create({
        // TODO
    });
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
        //
    });
});

/********************************* GET /items/ */

describe("GET, /items/", () => {
    it("gets a list of all items", async () => {
        //
    });
});

/************************* GET /items/item/:id */

describe("GET, /items/item/:id", () => {
    it("get an item by id", async () => {
        //
    });
});

/************************ GET /items/available */

describe("GET, /items/available", () => {
    it("gets list of all available items", async () => {
        //
    });
});

/***************************** GET /items/sold */

describe("GET, /items/sold", () => {
    it("gets list of all sold items", async () => {
        //
    });
});

/********************* PATCH /items/update/:id */

describe("PATCH, /items/update/:id", () => {
    it("does a full update on an item", async () => {
        //
    });

    it("does a partial update on an item", async () => {
        //
    });
});

/*********************** PATCH /items/sell/:id */

describe("PATCH, /items/sell/:id", () => {
    it("decreases quantity: 2+ quantity", async () => {
        //
    });

    it("decreases quantity and marks sold", async () => {
        //
    });
});

/*********************** PATCH /items/sold/:id */

describe("PATCH, /items/sold/:id", () => {
    it("marks an item as sold", async () => {
        //
    });
});

/******************** DELETE /items/delete/:id */

describe("DELETE, /items/delete/:id", () => {
    it("deletes an item by id", async () => {
        //
    });
});
