const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Mural = require("../models/mural");
const muralNewSchema = require("../schemas/muralNew.json");
const muralUpdateSchema = require("../schemas/muralUpdate.json");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    /** POST "/" { mural } => { mural }
     * Creates a new mural
     *
     * mural should be { title, description }
     *
     * Returns { id, title, description, isArchived }
     *
     * Authorization required: admin
     */
    try {
        const validator = jsonschema.validate(req.body, muralNewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const mural = await Mural.create(req.body);
        return res.status(201).json({ mural });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async (req, res, next) => {
    /** GET "/" => { [ murals ] }
     * Returns a list of all murals
     *
     * Returns { id, title, description }
     *
     * Authorization required: none
     */
});

router.get("/active", async (req, res, next) => {
    /** GET, "/active" => { [ murals ] }
     * Returns a list of all NON-archived murals
     *
     * Returns [ {id, title, description }, {id, title, description }, ...]
     *
     * Authorization required: none
     */
});

router.get("/archived", async (req, res, next) => {
    /** GET, "/archived" => { [ murals ] }
     * Returns a list of all archived murals
     *
     * Returns [ {id, title, description }, {id, title, description }, ...]
     *
     * Authorization required: none
     */
});

router.get("/mural/:id", async (req, res, next) => {
    /** GET "/{id}" => { mural }
     * Returns a mural by id
     *
     * id should be mural id
     *
     * Returns { id, title, description }
     *
     * Authorization required: none
     */
});

router.patch("/mural/:id", async (req, res, next) => {
    /** PATCH "/{id}" { mural } => { mural }
     * Partial update of a mural by id
     *
     * mural can be { title, description }
     * Note: this can be a partial update
     *
     * Returns { id, title, description }
     *
     * Authorization required: admin
     */
});

router.patch("/mural/:id/archive", async (req, res, next) => {
    /** PATCH "/mural/{id}/archive" => { mural }
     * Updates a mural as archived
     *
     * Returns { id, title, description, isArchived }
     *
     * Authorization required: admin
     */
});

router.patch("/mural/:id/unarchive", async (req, res, next) => {
    /** PATCH "/mural/{id}/unarchive" => { mural }
     * Updates a mural as NOT archived
     *
     * Returns { id, title, description, isArchived }
     *
     * Authorization required: admin
     */
});

router.delete("/mural/:id", async (req, res, next) => {
    /** DELETE "/{id}" => { msg: "Deleted." }
     * Deletes a mural
     *
     * id should be mural id
     *
     * Returns { msg: "Deleted." }
     *
     * Authorization required: admin
     */
});

module.exports = router;
