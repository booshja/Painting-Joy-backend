const express = require("express");
const jsonschema = require("jsonschema");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { BadRequestError } = require("../expressError");
const Order = require("../models/order");
const orderNewSchema = require("../schemas/orderNew.json");

const router = express.Router({ mergeParams: true });

const calculateOrderAmount = (listItems) => {
    /** Calculates total order amount
     * Do this on the server to prevent client-side manipulation
     *
     * Accepts [ listItems ]
     *      listItems should be an array of items objects associated w/ order
     *
     * Returns totalAmount
     */
    let totalAmount = 0;
    for (item of items) {
        totalAmount = totalAmount + item.price + item.shipping;
    }

    return totalAmount;
};

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

router.post("/create-payment-intent", async (req, res, next) => {
    /** POST "/create-payment-intent" => { payment intent }
     * Creates a payment intent through Stripe and returns the client secret
     *
     * Returns { clientSecret }
     *
     * Authorization required: none
     */
    try {
        // get totalAmount of all items in order
        const totalAmount = calculateOrderAmount(req.body.listItems);

        // if 0 or undefined returned, return BadRequestError
        if (!totalAmount)
            return res.status(400).send(new BadRequestError("No items."));

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(listItems),
            currency: "usd",
        });

        return res.send({
            clientSecret: paymentIntent.client_secret,
        });
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
    try {
        const order = await Order.markCompleted(+req.params.orderId);
        return res.status(200).json({ order });
    } catch (err) {
        return next(err);
    }
});

router.patch("/:orderId/remove/:itemId", async (req, res, next) => {
    /** PATCH "/{orderId}/remove/{itemId}" => { msg }
     * Removes an item from the order
     *
     * Returns { msg: "Item removed." }
     *
     * Authorization required: admin
     */
    try {
        const message = await Order.removeItem(
            +req.params.orderId,
            req.params.itemId
        );
        return res.status(200).json({ message });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:orderId", async (req, res, next) => {
    /** DELETE "/{orderId}" => { msg }
     * Deletes an order from the db by id
     *
     * Note: This is a logical delete.
     *      Records will still be kept in the database.
     *
     * Returns { msg: "Removed." }
     *
     * Authorization required: admin
     */
    try {
        const message = await Order.remove(+req.params.orderId);
        return res.status(200).json({ message });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
