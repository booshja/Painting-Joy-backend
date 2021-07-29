const { getEmailHtml, getMessage } = require("../email");

/****************************** getEmailHTML() */

describe("getEmailHTML", () => {
    it("returns html template", () => {
        const result = getEmailHtml();
        expect(result).toEqual(
            expect.stringContaining("<!DOCTYPE html PUBLIC")
        );
    });
});

/****************************** getEmailHTML() */

describe("getMessage", () => {
    it("returns message object", () => {
        const result = getMessage();
        expect(result).toEqual({
            to: expect.any(String),
            from: expect.any(String),
            subject: "You've got a new message!",
            text: "You've got a new message!",
            html: expect.stringContaining("<!DOCTYPE html PUBLIC"),
        });
    });
});
