describe("config can come from env", function () {
    it("works", () => {
        process.env.SECRET_KEY = "super-secret";
        process.env.PORT = "3000";
        process.env.DATABASE_URL = "other";
        process.env.NODE_ENV = "other";

        const config = require("./config");
        expect(config.SECRET_KEY).toEqual("super-secret");
        expect(config.PORT).toEqual(3000);
        expect(config.getDatabaseUri()).toEqual("other");

        delete process.env.SECRET_KEY;
        delete process.env.PORT;
        delete process.env.DATABASE_URL;

        expect(config.getDatabaseUri()).toEqual("paintingjoy");
        process.env.NODE_ENV = "test";

        expect(config.getDatabaseUri()).toEqual("pj_test");
    });
});
