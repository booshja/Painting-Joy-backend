const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Message = require("../models/message");
const messageNewSchema = require("../schemas/messageNew.json");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    /** POST "/" { message } => { message }
     * Creates a new message
     *
     * message should be { name, email, message }
     *
     * Returns { id, name, email, message, received }
     *
     * Authorization required: none
     */
    try {
        const validator = jsonschema.validate(req.body, messageNewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errors);
        }

        const message = await Message.create(req.body);
        return res.status(201).json({ message });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async (req, res, next) => {
    /** GET "/" => { messages }
     * Get a list of all messages
     *
     * Returns [ { id, name, email, message, received, isArchived },
     *              { id, name, email, message, received, isArchived }, ...]
     *
     * Authorization required: admin
     */
    try {
        const messages = await Message.getAll();
        return res.status(200).json({ messages });
    } catch (err) {
        return next(err);
    }
});

router.get("/message/:id", async (req, res, next) => {
    /** GET "/{id}" => { message }
     * Get a message by id
     *
     * Returns { id, name, email, message, received, isArchived }
     *
     * Authorization required: admin
     */
    try {
        const message = await Message.get(+req.params.id);
        return res.status(200).json({ message });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get("/active", async (req, res, next) => {
    /** GET "/active" => { [ messages ] }
     * Get a list of non-archived messages
     *
     * Returns [ { id, name, email, message, received },
     *              { id, name, email, message, received }, ...]
     *
     * Authorization required: admin
     */
});

router.get("/archived", async (req, res, next) => {
    /** GET "/archived" => { [ messages ] }
     * Get a list of archived messages
     *
     * Returns [ { id, name, email, message, received },
     *              { id, name, email, message, received }, ...]
     *
     * Authorization required: admin
     */
});

router.patch("/archive/:id", async (req, res, next) => {
    /** PATCH "/archive/{id}" => { message }
     * Mark a message as "archived" by id
     *
     * Returns { id, name, email, message, received, isArchived }
     *
     * Authorization required: admin
     */
});

router.patch("/unarchive/:id", async (req, res, next) => {
    /** PATCH "/unarchive/{id}" => { message }
     * Mark a message as active by id
     *
     * Returns { id, email, name, message, received, isArchived }
     *
     * Authorization required: admin
     */
});

router.delete("/delete/:id", async (req, res, next) => {
    /** DELETE "/delete/{id}" => { msg: "Deleted." }
     * Delete a message by id
     *
     * Returns { msg: "Deleted" }
     *
     * Authorization required: admin
     */
});

module.exports = router;
