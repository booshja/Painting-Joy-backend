const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Message = require("../../models/message");

beforeAll(async () => {
    await db.query("DELETE FROM messages");

    await Message.create({
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

/****************************** POST /messages */

describe("POST, /messages/", () => {
    it("creates a new message", () => {
        //
    });
});

/******************************* GET /messages */

describe("GET, /messages/", () => {
    it("returns a list of all messages", () => {
        //
    });
});

/******************* GET /messages/message/:id */

describe("GET, /messages/message/:id", () => {
    it("returns a message by id", () => {
        //
    });
});

/************************ GET /messages/active */

describe("GET, /messages/active", () => {
    it("returns a list of all active messages", () => {
        //
    });
});

/********************** GET /messages/archived */

describe("GET, /messages/archived", () => {
    it("returns a list of all archived messages", () => {
        //
    });
});

/***************** PATCH /messages/archive/:id */

describe("PATCH, /messages/archive/:id", () => {
    it("archives a message by id", () => {
        //
    });
});

/*************** PATCH /messages/unarchive/:id */

describe("PATCH, /messages/unarchive/:id", () => {
    it("un-archives a message by id", () => {
        //
    });
});

/***************** DELETE /messages/delete/:id */

describe("DELETE, /messages/delete/:id", () => {
    it("deletes a message by id", () => {
        //
    });
});
