const express = require("express");
const jsonschema = require("jsonschema");
const multer = require("multer");
const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Mural = require("../models/mural");
const muralNewSchema = require("../schemas/muralNew.json");
const muralUpdateSchema = require("../schemas/muralUpdate.json");

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

router.post(
    "/upload/:muralId/image/:imageNum",
    ensureAdmin,
    upload.single("upload"),
    async (req, res) => {
        /** POST "/" { file upload } => { message }
         * Upload an image and save as binary to db
         *
         * Returns { msg: "Upload successful." }
         *
         * Authorization Required: admin
         **/
        try {
            // prep imageName
            const imageName = "image" + req.params.imageNum;
            // save image data to db
            const message = await Mural.uploadImage(
                +req.params.muralId,
                imageName,
                {
                    image: req.file.buffer,
                }
            );
            res.status(200).send({ message });
        } catch (err) {
            res.status(400).send(err);
        }
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

router.get("/", ensureAdmin, async (req, res, next) => {
    /** GET "/" => { [ murals ] }
     * Returns a list of all murals
     *
     * Returns { id, title, description }
     *
     * Authorization required: admin
     */
    try {
        const murals = await Mural.getAll();
        return res.status(200).json({ murals });
    } catch (err) {
        return next(err);
    }
});

router.get("/active", async (req, res, next) => {
    /** GET, "/active" => { [ murals ] }
     * Returns a list of all NON-archived murals
     *
     * Returns [ {id, title, description }, {id, title, description }, ...]
     *
     * Authorization required: none
     */
    try {
        const murals = await Mural.getActive();
        return res.status(200).json({ murals });
    } catch (err) {
        return next(err);
    }
});

router.get("/archived", ensureAdmin, async (req, res, next) => {
    /** GET, "/archived" => { [ murals ] }
     * Returns a list of all archived murals
     *
     * Returns [ {id, title, description }, {id, title, description }, ...]
     *
     * Authorization required: admin
     */
    try {
        const murals = await Mural.getArchived();
        return res.status(200).json({ murals });
    } catch (err) {
        return next(err);
    }
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
    try {
        const mural = await Mural.get(+req.params.id);
        return res.status(200).json({ mural });
    } catch (err) {
        return next(err);
    }
});

router.get("/mural/:muralId/image/:imageNum", async (req, res) => {
    /** GET "/mural/:muralId/image/:imageNum" => image
     * Returns the image associated with the mural
     *
     * Returns image data
     *
     * Authoriation required: none
     **/
    try {
        const imageName = "image" + req.params.imageNum;
        // get mural image by id and image name
        const muralImage = await Mural.getImage(+req.params.muralId, imageName);
        // if no mural or image, throw NotFoundError
        if (!muralImage) throw new NotFoundError("No image found.");

        //response header, use set
        res.set("Content-Type", "image/png");
        res.status(200).send(muralImage[Object.keys(muralImage)[0]]);
    } catch (err) {
        res.status(404).send(err);
    }
});

router.patch("/mural/:id", ensureAdmin, async (req, res, next) => {
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
    try {
        const validator = jsonschema.validate(req.body, muralUpdateSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const mural = await Mural.update(+req.params.id, req.body);
        return res.status(200).json({ mural });
    } catch (err) {
        return next(err);
    }
});

router.patch("/mural/:id/archive", ensureAdmin, async (req, res, next) => {
    /** PATCH "/mural/{id}/archive" => { mural }
     * Updates a mural as archived
     *
     * Returns { id, title, description, isArchived }
     *
     * Authorization required: admin
     */
    try {
        const mural = await Mural.archive(+req.params.id);
        return res.status(200).json({ mural });
    } catch (err) {
        return next(err);
    }
});

router.patch("/mural/:id/unarchive", ensureAdmin, async (req, res, next) => {
    /** PATCH "/mural/{id}/unarchive" => { mural }
     * Updates a mural as NOT archived
     *
     * Returns { id, title, description, isArchived }
     *
     * Authorization required: admin
     */
    try {
        const mural = await Mural.unArchive(+req.params.id);
        return res.status(200).json({ mural });
    } catch (err) {
        return next(err);
    }
});

router.delete(
    "/mural/:muralId/image/:imageNum",
    ensureAdmin,
    async (req, res) => {
        /** DELETE "/upload" => {message}
         * Deletes image data from a mural
         *
         * Returns { msg: "Deleted." }
         *
         * Authorization required: admin
         */
        try {
            const imageName = "image" + req.params.imageNum;
            // delete mural image by muralId and imageName
            const message = await Mural.deleteImage(
                +req.params.imageId,
                imageName
            );
            res.status(200).send({ message });
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.delete("/mural/:id", ensureAdmin, async (req, res, next) => {
    /** DELETE "/{id}" => { msg: "Deleted." }
     * Deletes a mural
     *
     * id should be mural id
     *
     * Returns { msg: "Deleted." }
     *
     * Authorization required: admin
     */
    try {
        const message = await Mural.delete(+req.params.id);
        return res.status(200).json({ message });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
