const request = require("supertest");

const app = require("./app");
const db = require("./db");

it("returns not found for site 404", async () => {
    const resp = await request(app).get("/doesnt-exist");
    expect(resp.statusCode).toEqual(404);
});

afterAll(() => {
    db.end();
});
