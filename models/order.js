const db = require("../db");
const {
    BadRequestError,
    NotFoundError,
    ExpressError,
} = require("../expressError");

class Order {
    /** Order Model */

    static async create(data) {
        /** Create an order (from data), update db, return new order data
         *
         * Data should be: { email, name, street, unit, city, state_code,
         *                  zipcode, phone, transaction_id, status, amount }
         *
         * Returns { id, email, name, street, unit, city, state_code,
         *              zipcode, phone, transaction_id, status, amount }
         *
         * Throws BadRequestError if incomplete or no data
         */
        // check for missing / incomplete data
        if (!data) throw new BadRequestError("No data.");
        if (
            !data.email ||
            !data.name ||
            !data.street ||
            !data.unit ||
            !data.city ||
            !data.state_code ||
            !data.zipcode ||
            !data.phone ||
            !data.transaction_id ||
            !data.status ||
            !data.amount
        )
            throw new BadRequestError("Missing data.");

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
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id,
                        email,
                        name,
                        street,
                        unit,
                        city,
                        state_code,
                        zipcode,
                        phone,
                        transaction_id,
                        status,
                        amount`,
            [
                data.email,
                data.name,
                data.street,
                data.unit,
                data.city,
                data.state_code,
                data.zipcode,
                data.phone,
                data.transaction_id,
                data.status,
                data.amount,
            ]
        );
        const order = result.rows[0];

        return order;
    }

    static async addItem(orderId, itemId) {
        /** Adds an item to an order
         *
         * Accepts orderId, itemId
         *
         * Returns { id, email, name, street, unit, city, state_code, zipcode, phone,
         *               transaction_id, status, amount, list_items: [ { id, name,
         *                  description, price, created }, { id, name, description,
         *                  price, created }, ...] }
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
                    email,
                    name,
                    street,
                    unit,
                    city,
                    state_code,
                    zipcode,
                    phone,
                    transaction_id,
                    status,
                    amount
                FROM orders
                WHERE id=$1`,
            [orderId]
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
                    created
                FROM items
                WHERE id=$1`,
            [itemId]
        );
        const item = itemRes.rows[0];

        // if no record returned, no such item, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${itemId}`);

        // query db to associate item with order
        const res = await db.query(
            `INSERT INTO orders_items(order_id, item_id)
                VALUES($1, $2)
                RETURNING id`,
            [orderId, itemId]
        );
        const association = res.rows[0];

        // if no association, something went wrong, throw 500 error
        if (!association) throw new ExpressError("Internal Error", 500);

        // query db for list of all items associated with order
        const listRes = await db.query(
            `SELECT i.name, i.description, i.price
                FROM orders_items oi
                JOIN items i
                ON oi.item_id=i.id
                WHERE oi.order_id=$1`,
            [orderId]
        );
        const list_items = listRes.rows;

        // insert list_items into order object and return
        order.list_items = list_items;

        return order;
    }

    static async get(id) {
        /** Get an order by id
         *
         * Accepts id
         *
         * Returns { id, email, name, street, unit, city, state_code,zipcode, phone,
         *               transaction_id, status, amount, list_items: [ { id, name,
         *                  description, price, created }, { id, name, description,
         *                  price, created }, ...] }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
        if (!id) throw new BadRequestError("No id provided.");

        const result = await db.query(
            `SELECT id,
                    email,
                    name,
                    street,
                    unit,
                    city,
                    state_code,
                    zipcode,
                    phone,
                    transaction_id,
                    status,
                    amount
                FROM orders
                WHERE id=$1`,
            [id]
        );
        const order = result.rows[0];

        if (!order) throw new NotFoundError(`No order: ${id}`);

        const itemsRes = await db.query(
            `SELECT i.name, i.description, i.price, i.quantity
                FROM orders_items oi
                JOIN items i
                ON oi.item_id=i.id
                WHERE oi.order_id=$1`,
            [id]
        );

        order.list_items = itemsRes.rows;

        return order;
    }

    static async getAll() {
        /** Get an array of all orders
         *
         * Returns [{ id, email, name, street, unit, city, state_code,
         *                  zipcode, phone, transaction_id, status, amount },
         *              { id, email, name, street, unit, city, state_code,
         *                  zipcode, phone, transaction_id, status, amount },
         *              ...]
         */
        // query db to get list of orders
        const result = await db.query(
            `SELECT id,
                    email,
                    name,
                    street,
                    unit,
                    city,
                    state_code,
                    zipcode,
                    phone,
                    transaction_id,
                    status,
                    amount
                FROM orders`
        );

        return result.rows;
    }

    static async getEmail(id) {
        /** Get customer's email from order by id
         *
         * Accepts id
         *
         * Returns { email: "example@email.com" }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to get email
        const result = await db.query(
            `SELECT email
                FROM orders
                WHERE id=$1`,
            [id]
        );
        const email = result.rows[0];

        // if no record returned, no order found, throw NotFoundError
        if (!email) throw new NotFoundError(`No order found: ${id}`);

        return email;
    }

    static async markShipped(id) {
        /** Update order status to shipped
         *
         * Accepts id
         *
         * Returns { id, email, name, street, unit, city, state_code,
         *              zipcode, phone, transaction_id, status, amount }
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
                        email,
                        name,
                        street,
                        unit,
                        city,
                        state_code,
                        zipcode,
                        phone,
                        transaction_id,
                        status,
                        amount`,
            ["Shipped", id]
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
         * Returns { id, email, name, street, unit, city, state_code,
         *              zipcode, phone, transaction_id, status, amount }
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
                        email,
                        name,
                        street,
                        unit,
                        city,
                        state_code,
                        zipcode,
                        phone,
                        transaction_id,
                        status,
                        amount`,
            ["Completed", id]
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
                    email,
                    name,
                    street,
                    unit,
                    city,
                    state_code,
                    zipcode,
                    phone,
                    transaction_id,
                    status,
                    amount
                FROM orders
                WHERE id=$1`,
            [orderId]
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
        const asscId = asscRes.rows[0].id;

        // if no record returned, no such association, throw NotFoundError
        if (!asscId)
            throw new NotFoundError(
                `Item ${itemId} not associated with order ${orderId}`
            );

        // query db to delete association
        const deleted = await db.query(
            `DELETE FROM orders_items
                WHERE id=$1`,
            [asscId]
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
}
module.exports = Order;
