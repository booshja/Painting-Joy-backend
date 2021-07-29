const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Order {
    /** Order Model */

    static async create() {
        /** Create an order,
         *      update db, return new order data
         *
         * Returns { id, status }
         */

        // query db to create new order
        const result = await db.query(
            `INSERT INTO orders (email,
                                name,
                                street,
                                unit,
                                city,
                                state_code,
                                zipcode,
                                phone,
                                transaction_id,
                                status,
                                amount)
                VALUES (pgp_sym_encrypt($1, $12),
                        pgp_sym_encrypt($2, $12),
                        pgp_sym_encrypt($3, $12),
                        pgp_sym_encrypt($4, $12),
                        pgp_sym_encrypt($5, $12),
                        pgp_sym_encrypt($6, $12),
                        pgp_sym_encrypt($7, $12),
                        pgp_sym_encrypt($8, $12),
                        pgp_sym_encrypt($9, $12),
                        $10,
                        $11)
                RETURNING id,
                        status`,
            [
                "Pending",
                "Pending",
                "Pending",
                "Pending",
                "Pending",
                "Pending",
                "Pending",
                "Pending",
                "Pending",
                "Pending",
                0,
                process.env.KEY,
            ]
        );
        const order = result.rows[0];

        return order;
    }

    static async addInfo(orderId, data) {
        /** Adds customer data to an order
         *
         * Accepts orderId, data
         * data should be { email, name, street, unit, city, stateCode,
         *                  zipcode, phone, amount }
         *
         * Returns { id, email, name, street, unit, city, stateCode, zipcode,
         *          phone, amount }
         *
         * Throws BadRequestError if missing orderId or data
         * Throws NotFoundError if no such order
         */
        // check for missing / incomplete input
        if (!orderId && !data) throw new BadRequestError("No input.");
        if (!orderId || !data) throw new BadRequestError("Missing input.");

        // query db to update order with data
        const result = await db.query(
            `UPDATE orders
                SET email = pgp_sym_encrypt($1, $10),
                    name = pgp_sym_encrypt($2, $10),
                    street = pgp_sym_encrypt($3, $10),
                    unit = pgp_sym_encrypt($4, $10),
                    city = pgp_sym_encrypt($5, $10),
                    state_code = pgp_sym_encrypt($6, $10),
                    zipcode = pgp_sym_encrypt($7, $10),
                    phone = pgp_sym_encrypt($8, $10),
                    amount = $9
                WHERE id = $11
                RETURNING id,
                        pgp_sym_decrypt(email, $10) AS email,
                        pgp_sym_decrypt(name, $10) AS name,
                        pgp_sym_decrypt(street, $10) AS street,
                        pgp_sym_decrypt(unit, $10) AS unit,
                        pgp_sym_decrypt(city, $10) AS city,
                        pgp_sym_decrypt(state_code, $10) AS "stateCode",
                        pgp_sym_decrypt(zipcode, $10) AS zipcode,
                        pgp_sym_decrypt(phone, $10) AS phone,
                        status,
                        amount`,
            [
                data.email,
                data.name,
                data.street,
                data.unit,
                data.city,
                data.stateCode,
                data.zipcode,
                data.phone,
                data.amount,
                process.env.KEY,
                orderId,
            ]
        );
        const order = result.rows[0];

        // if no record returned, invalid order id, throw NotFoundError
        if (!order) throw new NotFoundError(`No order: ${orderId}`);

        return order;
    }

    static async addItem(orderId, itemId) {
        /** Adds an item to an order
         *
         * Accepts orderId, itemId
         *
         * Returns { msg: "Added." }
         *
         * Throws BadRequestError if no missing orderId or itemId
         * Throws NotFoundError if no such item
         */
        // check for missing / incomplete ids
        if (!orderId && !itemId) throw new BadRequestError("No input.");
        if (!orderId || !itemId) throw new BadRequestError("Missing input.");

        // query db to get order
        const orderRes = await db.query(
            `SELECT id,
                    pgp_sym_decrypt(email, $2) AS email,
                        pgp_sym_decrypt(name, $2) AS name,
                        pgp_sym_decrypt(street, $2) AS street,
                        pgp_sym_decrypt(unit, $2) AS unit,
                        pgp_sym_decrypt(city, $2) AS city,
                        pgp_sym_decrypt(state_code, $2) AS "stateCode",
                        pgp_sym_decrypt(zipcode, $2) AS zipcode,
                        pgp_sym_decrypt(phone, $2) AS phone,
                        pgp_sym_decrypt(transaction_id, $2) AS "transactionId",
                    status,
                    amount
                FROM orders
                WHERE id=$1`,
            [orderId, process.env.KEY]
        );
        const order = orderRes.rows[0];

        // if no record returned, no such order, throw NotFoundError
        if (!order) throw new NotFoundError(`No order: ${orderId}`);

        // query db to get item
        const itemRes = await db.query(
            `SELECT id,
                    name,
                    description,
                    price,
                    shipping,
                    created
                FROM items
                WHERE id=$1`,
            [itemId]
        );
        const item = itemRes.rows[0];

        // if no record returned, no such item, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${itemId}`);

        // query db to associate item with order
        await db.query(
            `INSERT INTO orders_items(order_id, item_id)
                VALUES($1, $2)`,
            [orderId, itemId]
        );

        return { msg: "Added." };
    }

    static async get(id) {
        /** Get an order by id
         *
         * Accepts id
         *
         * Returns { id, email, name, street, unit, city, stateCode, zipcode, phone,
         *               transactionId, status, amount, listItems: [ { id, name,
         *                  description, price, created }, { id, name, description,
         *                  price, created }, ...] }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
        if (!id) throw new BadRequestError("No id provided.");

        const result = await db.query(
            `SELECT id,
                    pgp_sym_decrypt(email, $2) AS email,
                        pgp_sym_decrypt(name, $2) AS name,
                        pgp_sym_decrypt(street, $2) AS street,
                        pgp_sym_decrypt(unit, $2) AS unit,
                        pgp_sym_decrypt(city, $2) AS city,
                        pgp_sym_decrypt(state_code, $2) AS "stateCode",
                        pgp_sym_decrypt(zipcode, $2) AS zipcode,
                        pgp_sym_decrypt(phone, $2) AS phone,
                        pgp_sym_decrypt(transaction_id, $2) AS "transactionId",
                    status,
                    amount
                FROM orders
                WHERE id=$1 AND is_deleted=false`,
            [id, process.env.KEY]
        );
        const order = result.rows[0];

        if (!order) throw new NotFoundError(`No order: ${id}`);

        const itemsRes = await db.query(
            `SELECT i.id,
                    i.name,
                    i.description,
                    i.price,
                    i.shipping,
                    i.quantity
                FROM orders_items oi
                JOIN items i
                ON oi.item_id=i.id
                WHERE oi.order_id=$1`,
            [id]
        );

        order.listItems = itemsRes.rows;

        return order;
    }

    static async getAll() {
        /** Get an array of all orders
         *
         * Returns [{ id, email, name, street, unit, city, stateCode,
         *                  zipcode, phone, transactionId, status, amount },
         *              { id, email, name, street, unit, city, stateCode,
         *                  zipcode, phone, transactionId, status, amount },
         *              ...]
         */
        // query db to get list of orders
        const result = await db.query(
            `SELECT id,
                    pgp_sym_decrypt(email, $1) AS email,
                        pgp_sym_decrypt(name, $1) AS name,
                        pgp_sym_decrypt(street, $1) AS street,
                        pgp_sym_decrypt(unit, $1) AS unit,
                        pgp_sym_decrypt(city, $1) AS city,
                        pgp_sym_decrypt(state_code, $1) AS "stateCode",
                        pgp_sym_decrypt(zipcode, $1) AS zipcode,
                        pgp_sym_decrypt(phone, $1) AS phone,
                        pgp_sym_decrypt(transaction_id, $1) AS "transactionId",
                    status,
                    amount
                FROM orders`,
            [process.env.KEY]
        );

        return result.rows;
    }

    static async markConfirmed(id, transactionId) {
        /** Update order status to confirmed
         *
         * Accepts id
         *
         * Returns { id, email, name, street, unit, city, stateCode,
         *              zipcode, phone, transactionId, status, amount }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
        // check for missing input
        if (!id || !transactionId)
            throw new BadRequestError("No input provided.");

        // query db to update transactionId and status to "Confirmed"
        const result = await db.query(
            `UPDATE orders
                SET status = $1,
                    transaction_id = pgp_sym_encrypt($3, $4)
                WHERE id = $2
                RETURNING id,
                        pgp_sym_decrypt(email, $4) AS email,
                        pgp_sym_decrypt(name, $4) AS name,
                        pgp_sym_decrypt(street, $4) AS street,
                        pgp_sym_decrypt(unit, $4) AS unit,
                        pgp_sym_decrypt(city, $4) AS city,
                        pgp_sym_decrypt(state_code, $4) AS "stateCode",
                        pgp_sym_decrypt(zipcode, $4) AS zipcode,
                        pgp_sym_decrypt(phone, $4) AS phone,
                        pgp_sym_decrypt(transaction_id, $4) AS "transactionId",
                        status,
                        amount`,
            ["Confirmed", id, transactionId, process.env.KEY]
        );
        const order = result.rows[0];

        // if no record returned, no order found, throw NotFoundError
        if (!order) throw new NotFoundError(`No order: ${id}`);

        return order;
    }

    static async markShipped(id) {
        /** Update order status to shipped
         *
         * Accepts id
         *
         * Returns { id, email, name, street, unit, city, stateCode,
         *              zipcode, phone, transactionId, status, amount }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to update status to "Shipped"
        const result = await db.query(
            `UPDATE orders
                SET status = $1
                WHERE id = $2
                RETURNING id,
                        pgp_sym_decrypt(email, $3) AS email,
                        pgp_sym_decrypt(name, $3) AS name,
                        pgp_sym_decrypt(street, $3) AS street,
                        pgp_sym_decrypt(unit, $3) AS unit,
                        pgp_sym_decrypt(city, $3) AS city,
                        pgp_sym_decrypt(state_code, $3) AS "stateCode",
                        pgp_sym_decrypt(zipcode, $3) AS zipcode,
                        pgp_sym_decrypt(phone, $3) AS phone,
                        pgp_sym_decrypt(transaction_id, $3) AS "transactionId",
                        status,
                        amount`,
            ["Shipped", id, process.env.KEY]
        );
        const order = result.rows[0];

        // if no record returned, no order found, throw NotFoundError
        if (!order) throw new NotFoundError(`No order: ${id}`);

        return order;
    }

    static async markCompleted(id) {
        /** Update order status to completed
         *
         * Accepts id
         *
         * Returns { id, email, name, street, unit, city, stateCode,
         *              zipcode, phone, transactionId, status, amount }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to update status to "Completed"
        const result = await db.query(
            `UPDATE orders
                SET status = $1
                WHERE id = $2
                RETURNING id,
                        pgp_sym_decrypt(email, $3) AS email,
                        pgp_sym_decrypt(name, $3) AS name,
                        pgp_sym_decrypt(street, $3) AS street,
                        pgp_sym_decrypt(unit, $3) AS unit,
                        pgp_sym_decrypt(city, $3) AS city,
                        pgp_sym_decrypt(state_code, $3) AS "stateCode",
                        pgp_sym_decrypt(zipcode, $3) AS zipcode,
                        pgp_sym_decrypt(phone, $3) AS phone,
                        pgp_sym_decrypt(transaction_id, $3) AS "transactionId",
                        status,
                        amount`,
            ["Completed", id, process.env.KEY]
        );
        const order = result.rows[0];

        // if no record returned, no order found, throw NotFoundError
        if (!order) throw new NotFoundError(`No order: ${id}`);

        return order;
    }

    static async removeItem(orderId, itemId) {
        /** Remove an item from an order
         *
         * Accepts orderId, itemId
         *
         * Returns { msg: "Item removed." }
         *
         * Throws BadRequestError if missing id(s)
         * Throws NotFoundError if order, item, or relationship not found
         */
        //check for missing / incomplete ids
        if (!orderId && !itemId) throw new BadRequestError("No input");
        if (!orderId || !itemId) throw new BadRequestError("Missing input");

        // query db to get order
        const orderRes = await db.query(
            `SELECT id,
                    pgp_sym_decrypt(email, $2) AS email,
                        pgp_sym_decrypt(name, $2) AS name,
                        pgp_sym_decrypt(street, $2) AS street,
                        pgp_sym_decrypt(unit, $2) AS unit,
                        pgp_sym_decrypt(city, $2) AS city,
                        pgp_sym_decrypt(state_code, $2) AS "stateCode",
                        pgp_sym_decrypt(zipcode, $2) AS zipcode,
                        pgp_sym_decrypt(phone, $2) AS phone,
                        pgp_sym_decrypt(transaction_id, $2) AS "transactionId",
                    status,
                    amount
                FROM orders
                WHERE id=$1`,
            [orderId, process.env.KEY]
        );
        const order = orderRes.rows[0];

        // if no record returned, no such order, throw NotFoundError
        if (!order) throw new NotFoundError(`No order: ${orderId}`);

        // query db to get item
        const itemRes = await db.query(
            `SELECT id,
                    name,
                    description,
                    price,
                    shipping,
                    created
                FROM items
                WHERE id=$1`,
            [itemId]
        );
        const item = itemRes.rows[0];

        // if no record returned, no such item, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${itemId}`);

        // query db for association
        const asscRes = await db.query(
            `SELECT id
                FROM orders_items
                WHERE order_id=$1 AND item_id=$2`,
            [orderId, itemId]
        );
        const asscId = asscRes.rows[0];

        // if no record returned, no such association, throw NotFoundError
        if (!asscId)
            throw new NotFoundError(
                `Item ${itemId} not associated with order ${orderId}`
            );

        // query db to delete association
        const deleted = await db.query(
            `DELETE FROM orders_items
                WHERE id=$1`,
            [asscId.id]
        );

        return { msg: "Item removed." };
    }

    static async remove(id) {
        /** Remove an order by id
         * NOTE: This is a logical delete. The record will still remain in the db.
         *
         * Accepts id
         *
         * Returns { msg: "Removed." }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if not found
         */
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to update is_deleted to true
        const result = await db.query(
            `UPDATE orders
                SET is_deleted = $1
                WHERE id = $2
                RETURNING id`,
            [true, id]
        );
        const removed = result.rows[0];

        // if no record returned, no order found, throw NotFoundError
        if (!removed) throw new NotFoundError(`No order found: ${id}`);

        return { msg: "Removed." };
    }

    static async delete(id) {
        /** Deletes an order by id
         * NOTE: This is a full deletion. The record will not remain.
         *
         * Accepts id
         *
         * Returns { msg: "Aborted." }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if not found
         */
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to delete order
        const result = await db.query(
            `DELETE FROM orders
                WHERE id = $1
                RETURNING id`,
            [id]
        );
        const deleted = result.rows[0];

        // if no record returned, no order found, throw NotFoundError
        if (!deleted) throw new NotFoundError(`No order found: ${id}`);

        return { msg: "Aborted." };
    }
}
module.exports = Order;
