const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Item {
    /** Item Model */

    static async create(data) {
        /** Create an item (from data), update db, return new item
         *
         * Data should be: { name, description, price, quantity }
         *
         * Returns: { id, name, description, price, quantity, created,
         *                      isSold }
         *
         * Throws BadRequestError if incomplete or no data
         */
        if (!data) throw new BadRequestError("No data.");
        if (!data.name || !data.description || !data.price || !data.quantity)
            throw new BadRequestError("Missing data.");

        const result = await db.query(
            `INSERT INTO items(name,
                            description,
                            price,
                            quantity)
                VALUES($1,
                        $2,
                        $3,
                        $4)
                RETURNING id,
                        name,
                        description,
                        price,
                        quantity,
                        created,
                        is_sold AS "isSold"`,
            [data.name, data.description, data.price, data.quantity]
        );

        const item = result.rows[0];

        return item;
    }

    static async get(id) {
        /** Get an item by id
         *
         * Accepts id
         *
         * Returns { id, name, description, price, quantity, created, isSold }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no item found by id
         */
    }

    static async getAll() {
        /** Gets an array of items
         *
         * Returns [{ id, name, description, price, quantity, created, isSold },
         *              { id, name, description, price, quantity, created, isSold },
         *              ...]
         */
    }

    static async getAllAvailable() {
        /** Gets an array of items that are NOT sold
         *
         * Returns [{ id, name, description, price, quantity, created },
         *              { id, name, description, price, quantity, created }, ...]
         */
    }

    static async getAllSold() {
        /** Gets an array of items that ARE sold
         *
         * Returns [{ id, name, description, price, quantity, created },
         *              { id, name, description, price, quantity, created }, ...]
         */
    }

    static async update(id, data) {
        /** Update item data with data
         *
         * This is a partial update, it will only change given fields
         *
         * Data can include: { name, description, price, quantity }
         *
         * Returns: { id, name, description, price, quantity, created, ,
         *              isSold }
         *
         * Throws BadRequestError if no data
         * Throws NotFoundError if no item found
         */
    }

    static async markSold(id) {
        /** Mark item as sold by id
         *
         * Accepts id
         *
         * Returns: { id, name, description, price, quantity, created, ,
         *              isSold }
         */
    }

    static async delete(id) {
        /** Delete an item by id
         *
         * Accepts id
         *
         * Returns { msg: "Deleted." }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if not found
         */
    }
}

module.exports = Item;
