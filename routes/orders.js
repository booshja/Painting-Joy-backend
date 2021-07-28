const express = require("express");
const jsonschema = require("jsonschema");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Order = require("../models/order");
const Item = require("../models/item");
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
    for (item of listItems) {
        totalAmount = totalAmount + item.price + item.shipping;
    }

    return totalAmount;
};

// router.post("/", async (req, res, next) => {
//     /** POST "/"  => { order }
//      * Create a new order
//      *
//      * Returns { id, status }
//      *
//      * Authorization required: none
//      */
//     try {
//         // create new pending order in db
//         const order = await Order.create();

//         return res.status(201).json({ order });
//     } catch (err) {
//         return next(err);
//     }
// });

router.post("/order/:orderId/info", async (req, res, next) => {
    /** POST "/order/{orderId}/info" { data } => { order }
     * Adds customer data to existing order by id
     *
     * data should be { email, name, street, unit, city, stateCode, zipcode,
     *                  phone, amount }
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *          phone, status, amount }
     *
     * Authorization required: none
     */
    try {
        // validate json schema for order
        const validator = jsonschema.validate(req.body, orderNewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        // Add customer data to order and db, return order
        const order = await Order.addInfo(+req.params.orderId, req.body);
        return res.status(200).json({ order });
    } catch (err) {
        return next(err);
    }
});

router.post("/checkout", async (req, res, next) => {
    /** POST "/checkout" { items } => { order }
     * Creates order, adds items to it, removes items from inventory
     *
     * items should be [ {item}, {item}, {item}, ... ]
     *      item should be { itemId, quantity }
     *
     * Returns { order, notAdded }
     *
     * Authorization required: none
     */
    try {
        // if no ids or nothing in ids, throw BadRequestError
        if (!req.body.items || Object.keys(req.body.items).length === 0)
            throw new BadRequestError("No item ids.");

        // create new order
        let order = await Order.create();

        const notAdded = [];

        for (item of req.body.items) {
            // decrease item quantity, add item to order
            for (let i = 0; i < item.quantity; i++) {
                try {
                    await Order.addItem(order.id, item.id);
                } catch (err) {
                    // if error add item to notAdded array
                    notAdded.push(item.id);
                    continue;
                }
            }
        }

        order = await Order.get(order.id);

        return res.status(200).json({ order, notAdded });
    } catch (err) {
        return next(err);
    }
});

router.post(
    "/order/:orderId/add/:itemId",
    ensureAdmin,
    async (req, res, next) => {
        /** POST "/order/{orderId}/add/{itemId}" => { order }
         * Adds an existing item to an existing order by orderId & itemId
         *
         * Returns { id, email, name, street, unit, city, stateCode, zipcode,
         *              phone, transactionId, status, amount, listItems }
         * Where listItems is an array of all items associated with the order.
         *
         * Authorization required: admin
         */
        try {
            const message = await Order.addItem(
                +req.params.orderId,
                req.params.itemId
            );
            return res.status(200).json({ message });
        } catch (err) {
            return next(err);
        }
    }
);

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

router.get("/order/:orderId", ensureAdmin, async (req, res, next) => {
    /** GET "/order/{orderId}" => { order }
     * Gets an order by id
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount, listItems }
     * Where listItems is an array of all items associated with the order.
     *
     * Authorization required: admin
     */
    try {
        const order = await Order.get(+req.params.orderId);
        return res.status(200).json({ order });
    } catch (err) {
        return next(err);
    }
});

router.get("/", ensureAdmin, async (req, res, next) => {
    /** GET "/" => { [ orders ] }
     * Gets an array of all orders
     *
     * Returns [{ id, email, name, street, unit, city, stateCode,
     *                  zipcode, phone, transactionId, status, amount },
     *              { id, email, name, street, unit, city, stateCode,
     *                  zipcode, phone, transactionId, status, amount },
     *              ...]
     *
     * Authorization required: admin
     */
    try {
        const orders = await Order.getAll();
        return res.status(200).json({ orders });
    } catch (err) {
        return next(err);
    }
});

router.patch("/order/:orderId/confirm", ensureAdmin, async (req, res, next) => {
    /** PATCH "/order/{orderId}/confirm" { transactionId } => { order }
     * Changes order's status to "Confirmed"
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount }
     *
     * Authorization required: admin
     */
    try {
        const order = await Order.markConfirmed(
            +req.params.orderId,
            req.body.transactionId
        );
        return res.status(200).json({ order });
    } catch (err) {
        return next(err);
    }
});

router.patch("/order/:orderId/ship", ensureAdmin, async (req, res, next) => {
    /** PATCH "/order/{orderId}/ship" => { order }
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

router.patch(
    "/order/:orderId/complete",
    ensureAdmin,
    async (req, res, next) => {
        /** PATCH "/order/{orderId}/complete" => { order }
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
    }
);

router.patch(
    "/order/:orderId/remove/:itemId",
    ensureAdmin,
    async (req, res, next) => {
        /** PATCH "/order/{orderId}/remove/{itemId}" => { msg }
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
    }
);

router.delete("/order/:orderId/abort", async (req, res, next) => {
    /** DELETE "/order/{orderId}/abort" => { message }
     * Deletes order and adds invetory back for items in order
     *
     * Returns { msg: "Aborted." }
     *
     * Authorization required: none
     */
    try {
        // get order from db
        const order = await Order.get(+req.params.orderId);

        // add back items into db availability
        for (item of order.listItems) {
            await Item.update(item.id, {
                quantity: item.quantity + 1,
                is_sold: false,
            });
        }

        // delete order from db
        const message = await Order.delete(+req.params.orderId);
        return res.status(200).json({ message });
    } catch (err) {
        return next(err);
    }
});

router.delete("/order/:orderId", ensureAdmin, async (req, res, next) => {
    /** DELETE "/order/{orderId}" => { msg }
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
