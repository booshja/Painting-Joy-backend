const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Item = require("../models/item");
const itemNewSchema = require("../schemas/itemNew.json");
const itemUpdateSchema = require("../schemas/itemUpdate.json");

const router = express.Router({ mergeParams: true });

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
});

router.patch("/sell/:id", async (req, res, next) => {
    /** PATCH "/sell/{id}" => { item }
     * Decreases quantity of item by 1, marks it as sold out if decreases to 0
     *
     * Returns { id, name, price, quantity, created, isSold }
     *
     * Authorization required: none
     */
});

router.patch("/sold/:id", async (req, res, next) => {
    /** PATCH "/sold:{id}" => { item }
     * Marks an item as sold, decreases quantity to 0
     *
     * Returns { id, name, description, price, quantity, created, isSold }
     *
     * Authorization required: admin
     */
});

router.delete("/delete/:id", async (req, res, next) => {
    /** DELETE "/delete/{id}" => { item }
     * Deletes an item
     *
     * Returns { msg: "Deleted." }
     *
     * Authorization required: admin
     */
});

module.exports = router;
