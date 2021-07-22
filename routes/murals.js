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
     * mural should be { title, description, price }
     *
     * Returns { id, title, description, price, isArchived }
     *
     * Authorization required: admin
     */
});

router.get("/", async (req, res, next) => {
    /** GET "/" => { [ murals ] }
     * Returns a list of all murals
     *
     * Returns { id, title, description, price }
     *
     * Authorization required: none
     */
});

router.get("/:id", async (req, res, next) => {
    /** GET "/{id}" => { mural }
     * Returns a mural by id
     *
     * id should be mural id
     *
     * Returns { id, title, description, price }
     *
     * Authorization required: none
     */
});

router.patch("/:id", async (req, res, next) => {
    /** PATCH "/{id}" { mural } => { mural }
     * Partial update of a mural by id
     *
     * mural can be { title, description, price }
     * Note: this can be a partial update
     *
     * Returns { id, title, description, price }
     *
     * Authorization required: admin
     */
});

router.delete("/:id", async (req, res, next) => {
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
