const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Homepage = require("../models/homepage");
const homepageNewSchema = require("../schemas/homepageNew.json");
const homepageUpdateSchema = require("../schemas/homepageUpdate.json");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    /** POST "/" { homepage } => { homepage }
     *
     * hompage should be { greeting, message }
     *
     * Returns { id, greeting, message }
     *
     * Authorization required: admin
     */
    try {
        const validator = jsonschema.validate(req.body, homepageNewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const homepage = await Homepage.create(req.body);
        return res.status(201).json({ homepage });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async (req, res, next) => {
    /** GET "/" => { homepage }
     *
     * Returns { id, greeting, message }
     *
     * Authorization required: none
     */
    try {
        const homepage = await Homepage.getData();
        return res.status(200).json({ homepage });
    } catch (err) {
        return next(err);
    }
});

router.put("/", async (req, res, next) => {
    /** PUT "/" { homepage } => { homepage }
     *
     * homepage should be { greeting, message }
     *
     * Returns { id, greeting, message }
     *
     * Authorization required: admin
     */
    try {
        const validator = jsonschema.validate(req.body, homepageUpdateSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const homepage = await Homepage.update(req.body);
        return res.status(200).json({ homepage });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
