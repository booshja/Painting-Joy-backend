const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Order {
    /** Order Model */

    static async create(data) {
        /** Create an order (from data), update db, return new order data
         *
         * Data should be: { email, cust_name, street, unit, city, state_code,
         *                  zipcode, phone_number, transaction_id, status, amount }
         *
         * Returns { id, email, cust_name, street, unit, city, state_code,
         *              zipcode, phone_number, transaction_id, status, amount }
         *
         * Throws BadRequestError if incomplete or no data
         */
        if (!data) throw new BadRequestError("No data.");
        if (
            !data.email ||
            !data.cust_name ||
            !data.street ||
            !data.unit ||
            !data.city ||
            !data.state_code ||
            !data.zipcode ||
            !data.phone_number ||
            !data.transaction_id ||
            !data.status ||
            !data.amount
        )
            throw new BadRequestError("Missing data.");

        const result = await db.query(
            `INSERT INTO orders (email,
                                cust_name,
                                street,
                                unit,
                                city,
                                state_code,
                                zipcode,
                                phone_number,
                                transaction_id,
                                status,
                                amount)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id,
                        email,
                        cust_name,
                        street,
                        unit,
                        city,
                        state_code,
                        zipcode,
                        phone_number,
                        transaction_id,
                        status,
                        amount`,
            [
                data.email,
                data.cust_name,
                data.street,
                data.unit,
                data.city,
                data.state_code,
                data.zipcode,
                data.phone_number,
                data.transaction_id,
                data.status,
                data.amount,
            ]
        );
        const order = result.rows[0];

        return order;
    }

    static async get(id) {
        /** Get an order by id
         *
         * Accepts id
         *
         * Returns { id, email, cust_name, street, unit, city, state_code,
         *              zipcode, phone_number, transaction_id, status, amount }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
        if (!id) throw new BadRequestError("No id provided.");

        const result = await db.query(
            `SELECT id,
                    email,
                    cust_name,
                    street,
                    unit,
                    city,
                    state_code,
                    zipcode,
                    phone_number,
                    transaction_id,
                    status,
                    amount
                FROM orders
                WHERE id=$1`,
            [id]
        );
        const order = result.rows[0];

        if (!order) throw new NotFoundError(`No order: ${id}`);

        return order;
    }

    static async getAll() {
        /** Get an array of all orders
         *
         * Returns [{ id, email, cust_name, street, unit, city, state_code,
         *                  zipcode, phone_number, transaction_id, status, amount },
         *              { id, email, cust_name, street, unit, city, state_code,
         *                  zipcode, phone_number, transaction_id, status, amount },
         *              ...]
         */
        const result = await db.query(
            `SELECT id,
                    email,
                    cust_name,
                    street,
                    unit,
                    city,
                    state_code,
                    zipcode,
                    phone_number,
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
    }

    static async markShipped(id) {
        /** Update order status to shipped
         *
         * Accepts id
         *
         * Returns { id, email, cust_name, street, unit, city, state_code,
         *              zipcode, phone_number, transaction_id, status, amount }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
    }

    static async markCompleted(id) {
        /** Update order status to completed
         *
         * Accepts id
         *
         * Returns { id, email, cust_name, street, unit, city, state_code,
         *              zipcode, phone_number, transaction_id, status, amount }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no such order
         */
    }

    static async remove(id) {
        /** Remove an order by id
         * NOTE: This is a logical delete. The record will still remain in the db.
         *
         * Accepts id
         *
         * Returns { msg: "Removed" }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if not found
         */
    }
}
module.exports = Order;
