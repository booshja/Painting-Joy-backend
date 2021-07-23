const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const IGPost = require("../models/igpost");
const igPostsNewSchema = require("../schemas/igPostsNew.json");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    /** POST "/" { igpost } => { igpost }
     * Creates a new igpost
     *
     * Returns { ig_id, caption, perm_url, image_url }
     *
     * Authorization required: admin
     */
    try {
        const validator = jsonschema.validate(req.body, igPostsNewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const igPost = await IGPost.add(req.body);
        return res.status(201).json({ igPost });
    } catch (err) {
        next(err);
    }
});

router.get("/", async (req, res, next) => {
    /** GET "/" => [ igposts ]
     * Returns a list of igposts
     *
     * Returns [ { ig_id, caption, perm_url, image_url },
     *              { ig_id, caption, perm_url, image_url }, ...]
     *
     * Authorization required: none
     */
});

router.get("/post/:id", async (req, res, next) => {
    /** GET "/post/{id}" => { igpost }
     * Returns an igpost by id
     *
     * Returns { ig_id, caption, perm_url, image_url }
     *
     * Authorization required: admin
     */
});

router.delete("/delete/:id", async (req, res, next) => {
    /** DELETE "/delete/:id" => { msg: "Deleted." }
     * Deletes an igpost by id
     *
     * Returns { msg: "Deleted." }
     *
     * Authorization required: admin
     */
});

module.exports = router;
