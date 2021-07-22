const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Order = require("../models/order");
const orderNewSchema = require("../schemas/orderNew.json");

const router = express.Router({ mergeParams: true });

router.post("/", (req, res, next) => {
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
});

router.post("/:orderId/add/:itemId", (req, res, next) => {
    /** POST "/add/{id}" => { order }
     * Adds an existing item to an existing order by orderId & itemId
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount, listItems }
     * Where listItems is an array of all items associated with the order.
     *
     * Authorization required: none
     */
});

router.get("/:orderId", (req, res, next) => {
    /** GET "/{orderId}" => { order }
     * Gets an order by id
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount, listItems }
     * Where listItems is an array of all items associated with the order.
     *
     * Authorization required: none
     */
});

router.get("/", (req, res, next) => {
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
});

router.patch("/:orderId/ship", (req, res, next) => {
    /** PATCH "/{orderId}/ship" => { order }
     * Changes order's status to "Shipped"
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount }
     *
     * Authorization required: admin
     */
});

router.patch("/:orderId/complete", (req, res, next) => {
    /** PATCH "/{orderId}/complete" => { order }
     * Changes order's status to "Completed"
     *
     * Returns { id, email, name, street, unit, city, stateCode, zipcode,
     *              phone, transactionId, status, amount }
     *
     * Authorization required: admin
     */
});

router.patch("/:orderId/remove/:itemId", (req, res, next) => {
    /** PATCH "/{orderId}/remove/{itemId}" => { msg }
     * Removes an item from the order
     *
     * Returns { msg: "Item removed." }
     *
     * Authorization required: admin
     */
});

router.delete("/:orderId", (req, res, next) => {
    /** DELETE "/{orderId}" => { msg }
     * Deletes an order from the db by id
     *
     * Returns { msg: "Removed." }
     *
     * Authorization required: admin
     */
});
