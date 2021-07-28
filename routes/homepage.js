const express = require("express");
const jsonschema = require("jsonschema");
const multer = require("multer");
const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Homepage = require("../models/homepage");
const homepageNewSchema = require("../schemas/homepageNew.json");
const homepageUpdateSchema = require("../schemas/homepageUpdate.json");

const router = express.Router({ mergeParams: true });

// multer options
const upload = multer({
    limits: {
        // limits filesize to 1 megabyte
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        // restricts file types to png, jpg, jpeg
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            // callback to throw error if filetype not image
            cb(new BadRequestError("Please upload an image."));
        }
        // callback to continue
        cb(undefined, true);
    },
});

router.post("/", ensureAdmin, async (req, res, next) => {
    /** POST "/" { homepage } => { homepage }
     * Creates a new mural
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

router.post(
    "/image",
    ensureAdmin,
    upload.single("upload"),
    async (req, res) => {
        /** POST "/image" { file upload } => { message }
         * Upload an image and save as binary to db
         *
         * Returns { msg: "Upload successful." }
         *
         * Authorization required: admin
         */
        try {
            const message = await Homepage.uploadImage({
                image: req.file.buffer,
            });
            res.status(200).send({ message });
        } catch (err) {
            res.status(400).send(err);
        }
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

router.get("/", async (req, res, next) => {
    /** GET "/" => { homepage }
     * Returns the homepage data
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

router.get("/image", async (req, res) => {
    /** GET "/image" => image
     * Returns the image associated with the homepage
     *
     * Returns image data
     *
     * Authentication required: none
     */
    try {
        // get homepage image
        const image = await Homepage.getImage();
        //if no image, throw NotFoundError
        if (!image) throw new NotFoundError("No image found.");

        //response header, use set
        res.set("Content-Type", "image/png");
        res.status(200).send(image);
    } catch (err) {
        res.status(404).send(err);
    }
});

router.put("/", ensureAdmin, async (req, res, next) => {
    /** PUT "/" { homepage } => { homepage }
     * Updates the homepage data
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

router.delete("/image", ensureAdmin, async (req, res) => {
    /** DELETE "/upload" => { message }
     * Deletes image data from homepage
     *
     * Returns { msg: "Deleted." }
     *
     * Authorization required: admin
     */
    try {
        const message = await Homepage.deleteImage();
        res.status(200).send({ message });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
