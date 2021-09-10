const jsonschema = require("jsonschema");
const Admin = require("../models/admin");
const express = require("express");
const router = new express.Router();
const { createAdminToken } = require("../helpers/tokens");
const adminAuthSchema = require("../schemas/adminAuth.json");
const { BadRequestError } = require("../expressError");
const { validateHuman } = require("../helpers/recaptcha");

router.post("/token", async (req, res, next) => {
    /** POST "/token" { username, password } => { token }
     *
     * Returns JWT for authentication
     *
     * Authorization required: none
     */
    // validate recaptcha
    const human = await validateHuman(req.body.token);
    if (!human) {
        return res.status(400).json({
            errors: ["You've been detected as a bot."],
        });
    }
    try {
        const validator = jsonschema.validate(req.body, adminAuthSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            return next(errors);
        }

        const { username, password } = req.body;
        const admin = await Admin.authenticate(username, password);
        const token = createAdminToken(admin);
        return res.status(200).json({ token });
    } catch (err) {
        return next(err);
    }
});

router.post("/reg", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.register({
            username,
            password,
            firstName: "Senor Test",
            email: "jacob.andes@gmail.com",
            secretQuestion: "Secre?",
            secretAnswer: "secret",
        });
        return res.status(201).json({ admin });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
