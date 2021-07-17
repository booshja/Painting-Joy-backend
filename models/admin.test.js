const { NotFoundError, UnauthorizedError } = require("../expressError");
const db = require("../db.js");
const Admin = require("./admin");

beforeAll(async function () {
    await db.query("DELETE FROM admins");

    await db.query(
        `INSERT INTO admins(username, password, email, first_name, secret_question, secret_answer)
        VALUES ('testadmin1', 'password', 'test@email.com', 'Test', 'Secret question?', 'Secret Answer')`
    );
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

/******************************** authenticate */

describe("authenticate", () => {
    it("authenticates", async () => {
        const admin = await Admin.authenticate("testadmin1", "password");
        expect(admin).toEqual({
            username: "testadmin1",
            firstName: "Test",
            email: "test@email.com",
        });
    });

    it("throws UnauthorizedError if no such admin", async () => {
        try {
            await Admin.authenticate("wrong", "badbadbad");
            fail();
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    it("throws UnauthorizedError if wrong password", async () => {
        try {
            await Admin.authenticate("testadmin1", "nonono");
            fail();
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });
});

/*********************************** updatePwd */

describe("updatePwd", () => {
    it("updates admin password", async () => {
        const admin = await Admin.updatePwd("testadmin1", "newpassword");
        expect(admin).toEqual({
            username: "testadmin1",
            firstName: "Test",
            email: "test@email.com",
        });
    });

    it("throws NotFoundError if no such admin", async () => {
        try {
            await Admin.updatePwd("not-an-admin", "nooope");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/*************************** getSecretQuestion */

describe("getSecretQuestion", () => {
    it("returns secret question", async () => {
        const admin = await Admin.getSecretQuestion("testadmin1");
        expect(admin).toEqual({
            username: "testadmin1",
            secretQuestion: "Secret question?",
        });
    });

    it("throws NotFoundError if no such admin", async () => {
        try {
            await Admin.getSecretQuestion("nobody-here");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/******************** authenticateSecretAnswer */

describe("authenticateSecretAnswer", () => {
    it("authenticates the secret answer", async () => {
        const result = await Admin.authenticateSecretAnswer(
            "testadmin1",
            "Secret Answer"
        );
        expect(result).toEqual({ msg: "Valid" });
    });

    it("throws UnauthorizedError for incorrect secret answer", async () => {
        try {
            await Admin.authenticateSecretAnswer("testadmin1", "Idk!");
            fail();
        } catch (err) {
            exepct(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    it("throws NotFoundError if no such admin", async () => {
        try {
            await Admin.authenticateSecretAnswer("not-me", "badbad");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
