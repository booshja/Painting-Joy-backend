const express = require("express");
const jsonschema = require("jsonschema");
const multer = require("multer");
const { BadRequestError, NotFoundError } = require("../expressError");
const Item = require("../models/item");
const itemNewSchema = require("../schemas/itemNew.json");
const itemUpdateSchema = require("../schemas/itemUpdate.json");

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

router.post("/", async (req, res, next) => {
    /** POST "/" { item } => { item }
     * Create a new store item
     *
     * item should be { name, description, price, quantity }
     *
     * Returns { id, name, description, price, quantity, created, isSold }
     *
     * Authorization required: admin
     */
    try {
        const validator = jsonschema.validate(req.body, itemNewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const item = await Item.create(req.body);
        return res.status(201).json({ item });
    } catch (err) {
        return next(err);
    }
});

router.post(
    "/upload/:itemId",
    upload.single("upload"),
    async (req, res) => {
        /** POST "/upload/{itemId}" { file upload } => { message }
         * Upload an image and save as binary to db
         *
         * Returns { msg: "Upload successful." }
         *
         * Authorization Required: admin
         **/
        try {
            const message = await Item.uploadImage(+req.params.itemId, {
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
    /** GET "/" => [ items ]
     * Returns a list of all items
     *
     * Returns [ { id, name, description, price, quantity, created, isSold},
     *              { id, name, description, price, quantity, created, isSold}, ...]
     *
     * Authorization required: none
     */
    try {
        const items = await Item.getAll();
        return res.status(200).json({ items });
    } catch (err) {
        return next(err);
    }
});

router.get("/item/:id", async (req, res, next) => {
    /** GET "/item/{id}" => { item }
     * Returns an item by id
     *
     * id should be item id
     *
     * Returns { id name, description, price, quantity, created, isSold }
     *
     * Authorization required: none
     */
    try {
        const item = await Item.get(+req.params.id);
        return res.status(200).json({ item });
    } catch (err) {
        return next(err);
    }
});

router.get("/item/:itemId/image", async (req, res) => {
    /** GET "/item/:itemId/image" => image
     * Returns the image associated with the item
     *
     * Returns image data
     *
     * Authoriation required: none
     **/
    try {
        // get item image by id
        const itemImage = await Item.getImage(+req.params.itemId);
        // if no item or no image in item, throw NotFoundError
        if (!itemImage) throw new NotFoundError("No image found.");

        //response header, use set
        res.set("Content-Type", "image/png");
        res.status(200).send(itemImage);
    } catch (err) {
        res.status(404).send(err);
    }
});

router.get("/available", async (req, res, next) => {
    /** GET "/available" => [ items ]
     * Returns a list of available items
     *
     * Returns [ { id, name, description, price, quantity, created, isSold},
     *              { id, name, description, price, quantity, created, isSold}, ...]
     *
     * Authorization required: none
     */
    try {
        const items = await Item.getAllAvailable();
        return res.status(200).json({ items });
    } catch (err) {
        return next(err);
    }
});

router.get("/sold", async (req, res, next) => {
    /** GET "/sold" => [ items ]
     * Returns a list of sold items
     *
     * Returns [ { id, name, description, price, quantity, created, isSold},
     *              { id, name, description, price, quantity, created, isSold}, ...]
     *
     * Authorization required: none
     */
    try {
        const items = await Item.getAllSold();
        return res.status(200).json({ items });
    } catch (err) {
        return next(err);
    }
});

router.patch("/update/:id", async (req, res, next) => {
    /** PATCH "/update/{id}" { data }=> { item }
     * Updates an item. NOTE: This is a partial update, not all fields are required.
     *
     * data can be { name, description, price, quantity }
     *
     * Returns { id, name, description, price, quantity, created, isSold }
     *
     * Authorization required: admin
     */
    try {
        const validator = jsonschema.validate(req.body, itemUpdateSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const item = await Item.update(+req.params.id, req.body);
        return res.status(200).json({ item });
    } catch (err) {
        return next(err);
    }
});

router.patch("/sell/:id", async (req, res, next) => {
    /** PATCH "/sell/{id}" => { item }
     * Decreases quantity of item by 1, marks it as sold out if decreases to 0
     *
     * Returns { id, name, price, quantity, created, isSold }
     *
     * Authorization required: none
     */
    try {
        const item = await Item.sell(+req.params.id);
        return res.status(200).json({ item });
    } catch (err) {
        return next(err);
    }
});

router.patch("/sold/:id", async (req, res, next) => {
    /** PATCH "/sold/{id}" => { item }
     * Marks an item as sold, decreases quantity to 0
     *
     * Returns { id, name, description, price, quantity, created, isSold }
     *
     * Authorization required: admin
     */
    try {
        const item = await Item.markSold(+req.params.id);
        return res.status(200).json({ item });
    } catch (err) {
        return next(err);
    }
});

router.delete("/item/:imageId/image", async (req, res) => {
    /** DELETE "/upload" => {message}
     * Deletes image data from an item
     *
     * Returns { msg: "Deleted." }
     *
     * Authorization required: admin
     */
    try {
        const message = await Item.deleteImage(+req.params.imageId);
        res.status(200).send({ message });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/delete/:id", async (req, res, next) => {
    /** DELETE "/delete/{id}" => { item }
     * Deletes an item
     *
     * Returns { msg: "Deleted." }
     *
     * Authorization required: admin
     */
    try {
        const message = await Item.delete(+req.params.id);
        return res.status(200).json({ message });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
