const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../../expressError");
const { authenticateJWT, ensureAdmin } = require("../auth");
const { SECRET_KEY } = require("../../config");

const testJwt = jwt.sign({ isAdmin: true }, SECRET_KEY);
const badJwt = jwt.sign({ isAdmin: true }, "noooope");

/***************************** authenticateJWT */

describe("authenticateJWT", () => {
    it("works: via header", () => {
        const req = { headers: { authorization: `Bearer ${testJwt}` } };
        const res = { locals: {} };
        const next = (err) => {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({
            admin: {
                iat: expect.any(Number),
                isAdmin: true,
            },
        });
    });

    it("works: no header", () => {
        const req = {};
        const res = { locals: {} };
        const next = (err) => {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
    });

    it("works: invalid token", () => {
        const req = { headers: { authorization: `Bearer ${badJwt}` } };
        const res = { locals: {} };
        const next = (err) => {
            expect(err).toBeFalsy();
        };
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
    });
});

describe("ensureAdmin", function () {
    it("works", function () {
        const req = {};
        const res = { locals: { admin: { username: "test", isAdmin: true } } };
        const next = function (err) {
            expect(err).toBeFalsy();
        };
        ensureAdmin(req, res, next);
    });

    it("gives unauth if not admin", function () {
        const req = {};
        const res = { locals: { admin: { username: "test", isAdmin: false } } };
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        ensureAdmin(req, res, next);
    });

    it("gives unauth if anon", function () {
        const req = {};
        const res = { locals: {} };
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        };
        ensureAdmin(req, res, next);
    });
});
