const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const IGPost = require("../models/igpost");

const router = express.Router({ mergeParams: true });

router.post("/", (req, res, next) => {
    /** POST "/" { igpost } => { igpost }
     * Creates a new igpost
     *
     * Returns { ig_id, caption, perm_url, image_url }
     *
     * Authorization required: admin
     */
});

router.get("/", (req, res, next) => {
    /** GET "/" => [ igposts ]
     * Returns a list of igposts
     *
     * Returns [ { ig_id, caption, perm_url, image_url },
     *              { ig_id, caption, perm_url, image_url }, ...]
     *
     * Authorization required: none
     */
});

router.get("/post/:id", (req, res, next) => {
    /** GET "/post/{id}" => { igpost }
     * Returns an igpost by id
     *
     * Returns { ig_id, caption, perm_url, image_url }
     *
     * Authorization required: admin
     */
});

router.delete("/delete/:id", (req, res, next) => {
    /** DELETE "/delete/:id" => { msg: "Deleted." }
     * Deletes an igpost by id
     *
     * Returns { msg: "Deleted." }
     *
     * Authorization required: admin
     */
});

module.exports = router;
