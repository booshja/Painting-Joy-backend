const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Message {
    /** Message Model */

    static async create(data) {
        /** Create a message (from data), update db, return new message data
         *
         * Data should be: { email, name, message }
         *
         * Returns { id, email, name, message, received }
         *
         * Throws BadRequestError if incomplete or no data
         */
        if (!data) throw new BadRequestError("No data.");
        if (!data.email || !data.name || !data.message)
            throw new BadRequestError("Missing data.");

        const result = await db.query(
            `INSERT INTO messages (email,
                                    name,
                                    message)
                VALUES ($1, $2, $3)
                RETURNING id, email, name, message, received`,
            [data.email, data.name, data.message]
        );
        const message = result.rows[0];

        return message;
    }

    static async get(id) {
        /** Get a message from id
         *
         * Accepts id
         *
         * Returns { id, email, name, message, received, isArchived }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no message found
         */
        if (!id) throw new BadRequestError("No id provided.");

        const result = await db.query(
            `SELECT id,
                    email,
                    name,
                    message,
                    received,
                    is_archived AS "isArchived"
                FROM messages
                WHERE id=$1`,
            [id]
        );
        const message = result.rows[0];

        if (!message) throw new NotFoundError(`No message: ${id}`);

        return message;
    }

    static async getAll() {
        /** Get an array of messages archived AND active
         *
         * Returns [{ id, email, name, message, received, isArchived },
         *              { id, email, name, message, received, isArchived }, ...]
         */
        const result = await db.query(
            `SELECT id,
                    email,
                    name,
                    message,
                    received,
                    is_archived AS "isArchived"
                FROM messages`
        );

        return result.rows;
    }

    static async getActive() {
        /** Get an array of messages that are NOT marked as archived or deleted
         *
         * Returns [{ id, email, name, message, received },
         *              { id, email, name, message, received }, ...]
         */
        const result = await db.query(
            `SELECT id,
                    email,
                    name,
                    message,
                    received
                FROM messages
                WHERE is_archived = false AND is_deleted = false`
        );

        console.log(JSON.stringify(result.rows));

        return result.rows;
    }

    static async getArchived() {
        /** Get an array of messages that ARE marked as archived
         *
         * Returns [{ id, email, name, message, received },
         *              { id, email, name, message, received }, ...]
         */
        const result = await db.query(
            `SELECT id,
                    email,
                    name,
                    message,
                    received
                FROM messages
                WHERE is_archived = true
                AND is_deleted = false`
        );

        return result.rows;
    }

    static async archive(id) {
        /** Archive a message
         *
         * Accepts id
         *
         * Returns { id, email, name, message, received, isArchived }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no message found by id
         */
        if (!id) throw new BadRequestError("No id provided.");

        const result = await db.query(
            `UPDATE messages
                SET is_archived = true
                WHERE id = $1
                RETURNING id,
                        email,
                        name,
                        message,
                        received,
                        is_archived AS "isArchived"`,
            [id]
        );

        const message = result.rows[0];

        if (!message) throw new NotFoundError(`No message: ${id}`);

        return message;
    }

    static async unArchive(id) {
        /** Sets the isActive field to false for a message
         *
         * Accepts id
         *
         * Returns { id, email, name, message, received, isArchived }
         *
         * Throws BadRequestError if no id
         * Throws NotFound Error if no message found by id
         */
        if (!id) throw new BadRequestError("No id provided.");

        const result = await db.query(
            `UPDATE messages
                SET is_archived = false
                WHERE id = $1
                RETURNING id,
                        email,
                        name,
                        message,
                        received,
                        is_archived AS "isArchived"`,
            [id]
        );

        const message = result.rows[0];

        if (!message) throw new NotFoundError(`No message: ${id}`);

        return message;
    }

    static async delete(id) {
        /** Deletes a message by id
         *
         * Accepts id
         *
         * Returns { msg: "Deleted." }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if not found
         */
        const result = await db.query(
            `DELETE FROM messages
                WHERE id=$1
                RETURNING id`,
            [id]
        );
        const removed = result.rows[0];

        if (!removed) throw new NotFoundError(`No message: ${id}`);

        return { msg: "Deleted." };
    }
}

module.exports = Message;
