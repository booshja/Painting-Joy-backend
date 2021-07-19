const {
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
} = require("../../expressError");
const db = require("../../db.js");
const Admin = require("../admin");

beforeAll(async function () {
    await db.query("DELETE FROM admins");

    await db.query(
        `INSERT INTO admins(username, password, email, first_name, secret_question, secret_answer)
        VALUES ('testadmin1', '$2b$04$QxqQ1VjLNfDZujQ48gWKLeNK.oRMf9Wc17j9SfOy082U0ZTb4VdBq', 'test@email.com', 'Test', 'Secret question?', '$2b$04$isfjJhFR9jemJNHPFK0RDOfeC.Wm0niqWSmJgq7oApZuJGC1GL9gK')`
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
        const admin = await Admin.authenticate("testadmin1", "password123");
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

    it("throws BadRequestError with no input", async () => {
        try {
            await Admin.authenticate();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError with missing input", async () => {
        try {
            await Admin.authenticate("hello");
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************ register */

describe("register", () => {
    const newAdmin = {
        username: "newadmin",
        firstName: "Testerino",
        email: "test@email.com",
        secretQuestion: "Secret question?",
        secretAnswer: "Secret Answer",
    };

    it("registers new admin", async () => {
        const admin = await Admin.register({
            ...newAdmin,
            password: "password123",
        });
        expect(admin).toEqual({
            username: "newadmin",
            firstName: "Testerino",
            email: "test@email.com",
        });
        const found = await db.query(
            "SELECT * FROM admins WHERE username = 'newadmin'"
        );
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    it("throws BadRequestError with duplicate username", async () => {
        try {
            await Admin.register({
                ...newAdmin,
                password: "password",
            });
            await Admin.register({
                ...newAdmin,
                password: "password",
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError with no input", async () => {
        try {
            await Admin.register();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError with missing input", async () => {
        try {
            await Admin.register("hello");
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
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

    it("throws BadRequestError with no input", async () => {
        try {
            await Admin.updatePwd();
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    it("throws BadRequestError with missing input", async () => {
        try {
            await Admin.updatePwd("hello");
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
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
            console.log(err);
            expect(err instanceof UnauthorizedError).toBeTruthy();
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
