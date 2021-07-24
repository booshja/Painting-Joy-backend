const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Order = require("../models/order");
const orderNewSchema = require("../schemas/orderNew.json");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    /** POST "/" { order, [ids] } => { order }
     * Create a new order
     * Optionally accepts an array of item ids to add to the order w/ creation
     *
     * order should be { name, email, street, unit, city, stateCode, zipcode,
     *                      phone ,transactionId status, amount }
     * ids (optional) should be an array of existing item ids to add to order
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount, listItems }
     * Where listItems is an array of all items associated with the order.
     *
     * Authorization required: none
     */
    try {
        const validator = jsonschema.validate(req.body.order, orderNewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        let order;
        if (req.body.ids) {
            order = await Order.create(req.body.order, req.body.ids);
        } else {
            order = await Order.create(req.body.order);
        }
        return res.status(201).json({ order });
    } catch (err) {
        console.log(err);
        return next(err);
    }
});

router.post("/:orderId/add/:itemId", async (req, res, next) => {
    /** POST "/add/{id}" => { order }
     * Adds an existing item to an existing order by orderId & itemId
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount, listItems }
     * Where listItems is an array of all items associated with the order.
     *
     * Authorization required: none
     */
    try {
        const order = await Order.addItem(
            +req.params.orderId,
            req.params.itemId
        );
        return res.status(200).json({ order });
    } catch (err) {
        return next(err);
    }
});

router.get("/:orderId", async (req, res, next) => {
    /** GET "/{orderId}" => { order }
     * Gets an order by id
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount, listItems }
     * Where listItems is an array of all items associated with the order.
     *
     * Authorization required: none
     */
    try {
        const order = await Order.get(+req.params.orderId);
        return res.status(200).json({ order });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async (req, res, next) => {
    /** GET "/" => { [ orders ] }
     * Gets an array of all orders
     *
     * Returns [{ id, email, name, street, unit, city, stateCode,
     *                  zipcode, phone, transactionId, status, amount },
     *              { id, email, name, street, unit, city, stateCode,
     *                  zipcode, phone, transactionId, status, amount },
     *              ...]
     *
     * Authorization required: none
     */
    try {
        const orders = await Order.getAll();
        return res.status(200).json({ orders });
    } catch (err) {
        return next(err);
    }
});

router.patch("/:orderId/ship", async (req, res, next) => {
    /** PATCH "/{orderId}/ship" => { order }
     * Changes order's status to "Shipped"
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount }
     *
     * Authorization required: admin
     */
    try {
        const order = await Order.markShipped(+req.params.orderId);
        return res.status(200).json({ order });
    } catch (err) {
        return next(err);
    }
});

router.patch("/:orderId/complete", async (req, res, next) => {
    /** PATCH "/{orderId}/complete" => { order }
     * Changes order's status to "Completed"
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount }
     *
     * Authorization required: admin
     */
});

router.patch("/:orderId/remove/:itemId", async (req, res, next) => {
    /** PATCH "/{orderId}/remove/{itemId}" => { msg }
     * Removes an item from the order
     *
     * Returns { msg: "Item removed." }
     *
     * Authorization required: admin
     */
});

router.delete("/:orderId", async (req, res, next) => {
    /** DELETE "/{orderId}" => { msg }
     * Deletes an order from the db by id
     *
     * Returns { msg: "Removed." }
     *
     * Authorization required: admin
     */
});

module.exports = router;
