// const jwt = require("jsonwebtoken");
const { createAdminToken } = require("../tokens");
const { SECRET_KEY } = require("../../config");

describe("createAdminToken", () => {
    it("works: admin", () => {
        const token = createAdminToken({ username: "tester", isAdmin: true });
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            isAdmin: true,
        });
    });

    it("works: not admin", () => {
        const token = createAdminToken({ username: "badbad", isAdmin: false });
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            isAdmin: false,
        });
    });

    it("works: default no admin status", () => {
        const token = createAdminToken({ username: "default" });
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            isAdmin: false,
        });
    });
});
