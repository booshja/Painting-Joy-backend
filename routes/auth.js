const jsonschema = require("jsonschema");
const Admin = require("../models/admin");
const express = require("express");
const router = new express.Router();
const { createAdminToken } = require("../helpers/tokens");
const adminAuthSchema = require("../schemas/adminAuth.json");
const { BadRequestError } = require("../expressError");

router.post("/token", async (req, res, next) => {
    /** POST "/token" { username, password } => { token }
     *
     * Returns JWT for authentication
     *
     * Authorization required: none
     */
    try {
        const validator = jsonschema.validate(req.body, adminAuthSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const { username, password } = req.body;
        const admin = await Admin.authenticate(username, password);
        const token = createAdminToken(admin);
        return res.status(200).json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
