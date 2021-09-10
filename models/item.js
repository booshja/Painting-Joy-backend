const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Item {
    /** Item Model */

    static async create(data) {
        /** Create an item (from data), update db, return new item
         *
         * Data should be: { name, description, price, quantity }
         *
         * Returns: { id, name, description, price, quantity, created,
         *                      shipping, isSold }
         *
         * Throws BadRequestError if incomplete or no data
         */
        // check for missing / incomplete data
        if (!data) throw new BadRequestError("No data.");
        if (
            !data.name ||
            !data.description ||
            !data.price ||
            !data.shipping ||
            !data.quantity
        )
            throw new BadRequestError("Missing data.");

        // query db to create new item
        const result = await db.query(
            `INSERT INTO items(name,
                            description,
                            price,
                            shipping,
                            quantity)
                VALUES($1,
                        $2,
                        $3,
                        $4,
                        $5)
                RETURNING id,
                        name,
                        description,
                        price,
                        shipping,
                        quantity,
                        created,
                        is_sold AS "isSold"`,
            [
                data.name,
                data.description,
                data.price,
                data.shipping,
                data.quantity,
            ]
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
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to get item
        const result = await db.query(
            `SELECT id,
                    name,
                    description,
                    price,
                    shipping,
                    quantity,
                    created,
                    is_sold AS "isSold"
                FROM items
                WHERE id=$1`,
            [id]
        );
        const item = result.rows[0];

        // if no record returned, no item found, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${id}`);

        return item;
    }

    static async getImage(id) {
        /** Get image data for an item by id
         *
         * Accepts id
         *
         * Returns { image }
         *
         * Throws BadRequestError if no input
         * Throws NotFoundError if no item
         */
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to get data
        const result = await db.query(
            `SELECT image
                FROM items
                WHERE id=$1`,
            [id]
        );
        const itemImg = result.rows[0];

        // if no record returned, no item found, throw NotFoundError
        if (!itemImg) throw new NotFoundError(`No item: ${id}`);

        return itemImg.image;
    }

    static async getQuantity(id) {
        /** Gets the quantity of an item by id
         *
         * Accepts id
         *
         * Returns { quantity }
         *
         * Throws BadRequestError if no input
         * Throws NotFoundError if no item found by id
         */
        // check for missing data
        if (!id) throw new BadRequestError("No input.");

        // query db to get data
        const result = await db.query(
            `SELECT quantity
                FROM items
                WHERE id = $1`,
            [id]
        );
        const quantity = result.rows[0];

        // if no record returned, no item found, throw NotFoundError
        if (!quantity) throw new NotFoundError(`No item: ${id}`);

        return quantity;
    }

    static async getAll() {
        /** Gets an array of items
         *
         * Returns [{ id, name, description, price, quantity, created, isSold },
         *              { id, name, description, price, quantity, created, isSold },
         *              ...]
         */
        // query db for list of all items
        const result = await db.query(
            `SELECT id,
                    name,
                    description,
                    price,
                    shipping,
                    quantity,
                    created,
                    is_sold AS "isSold"
                FROM items`
        );

        return result.rows;
    }

    static async getAllAvailable() {
        /** Gets an array of items that are NOT sold
         *
         * Returns [{ id, name, description, price, shipping, quantity,
         *              created }, { id, name, description, price, shipping,
         *              quantity, created }, ...]
         */
        // query db for list of all non-sold items
        const result = await db.query(
            `SELECT id,
                    name,
                    description,
                    price,
                    shipping,
                    quantity,
                    created
                FROM items
                WHERE is_sold = false`
        );

        return result.rows;
    }

    static async getAllSold() {
        /** Gets an array of items that ARE sold
         *
         * Returns [{ id, name, description, price, quantity, created },
         *              { id, name, description, price, quantity, created }, ...]
         */
        // query db for list of all sold items
        const result = await db.query(
            `SELECT id,
                    name,
                    description,
                    price,
                    shipping,
                    quantity,
                    created
                FROM items
                WHERE is_sold = true`
        );

        return result.rows;
    }

    static async uploadImage(id, data) {
        /** Updates item with image data
         *
         * data can include: { upload }
         *
         * Returns { msg: "Upload successful." }
         *
         * Throws BadRequestError if missing or incomplete input
         * Throws NotFoundError if item not found
         */
        // check for missing/incomplete inputs
        if (!id && !data) throw new BadRequestError("No input.");
        if (!id || !data) throw new BadRequestError("Missing input.");

        // query db to update item
        const result = await db.query(
            `UPDATE items
                SET image = $1
                WHERE id = $2
                RETURNING id`,
            [data.image, id]
        );
        const item = result.rows[0];

        // if no record returned, no item found, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${id}`);

        return { msg: "Upload successful." };
    }

    static async update(id, data) {
        /** Update item data with data
         * This is a partial update, it will only change given fields
         *
         * Data can include: { name, description, price, shipping, quantity,
         *                      isSold }
         *
         * Returns: { id, name, description, price, shipping, quantity,
         *              created, isSold }
         *
         * Throws BadRequestError if no data
         * Throws NotFoundError if no item found
         */
        // check for missing/incomplete inputs
        if (!id && !data) throw new BadRequestError("No input");
        if (!id || !data) throw new BadRequestError("Missing input");

        // prepare data for partial update
        const { setCols, values } = sqlForPartialUpdate(data, {
            isSold: "is_sold",
        });
        const idVarIdx = "$" + (values.length + 1);

        // prepare sql query statement for partial update
        const querySql = `UPDATE items
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING id,
                                    name,
                                    description,
                                    price,
                                    shipping,
                                    quantity,
                                    created,
                                    is_sold AS "isSold"`;

        // query db to update item
        const result = await db.query(querySql, [...values, id]);
        const item = result.rows[0];

        // if no record returned, no item found, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${id}`);

        return item;
    }

    static async sell(id) {
        /** Decrease quantity of an item by id
         * Updates is_sold to true if item quantity is decreased to 0
         *
         * Accepts id
         *
         * Returns { id, name, price, shipping, description, quantity, created,
         *              isSold }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if item not found
         * Throws BadRequestError if item already sold out
         */
        // check for missing input
        if (!id) throw new BadRequestError("No input.");

        // query db for item
        const result = await db.query(
            `SELECT id,
                    name,
                    price,
                    shipping,
                    description,
                    quantity,
                    created,
                    is_sold AS "isSold"
                FROM items
                WHERE id=$1`,
            [id]
        );
        const item = result.rows[0];

        // if no record returned, no such item, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${id}`);

        // if item sold out, throw BadRequestError
        if (item.isSold) throw new BadRequestError(`Item ${id} sold out.`);

        // decrease amount of quantity
        item.quantity = item.quantity - 1;

        // if quantity now 0, update isSold to true
        let updateRes;
        if (item.quantity === 0) {
            item.isSold = true;

            // query db to update item
            updateRes = await db.query(
                `UPDATE items
                    SET quantity=0, is_sold=true
                    WHERE id=$1
                    RETURNING id,
                            name,
                            price,
                            shipping,
                            description,
                            quantity,
                            created,
                            is_sold AS "isSold"`,
                [id]
            );
        } else {
            // query db to update item
            updateRes = await db.query(
                `UPDATE items
                    SET quantity=$1
                    WHERE id=$2
                    RETURNING id,
                            name,
                            price,
                            shipping,
                            description,
                            quantity,
                            created,
                            is_sold AS "isSold"`,
                [item.quantity, id]
            );
        }

        return updateRes.rows[0];
    }

    static async markSold(id) {
        /** Mark item as sold by id
         *
         * Accepts id
         *
         * Returns: { id, name, description, price, shipping, quantity,
         *              created, isSold }
         * Throws BadRequestError if no id
         * Throws NotFoundError if not found
         */
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to update is_sold status to true
        const result = await db.query(
            `UPDATE items
                SET is_sold = true, quantity = 0
                WHERE id=$1
                RETURNING id,
                        name,
                        description,
                        price,
                        shipping,
                        quantity,
                        created,
                        is_sold AS "isSold"`,
            [id]
        );
        const item = result.rows[0];

        // if no record returned, no item found, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${id}`);

        return item;
    }

    static async deleteImage(id) {
        /** Delete an items's image by id
         *
         * Accepts id
         *
         * Returns { msg: "Deleted." }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if not found
         */
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to change item's image to null
        const result = await db.query(
            `UPDATE items
                SET image = null
                WHERE id = $1
                RETURNING id`,
            [id]
        );
        const item = result.rows[0];

        // if no record returned, no item found, throw NotFoundError
        if (!item) throw new NotFoundError(`No item: ${id}`);

        return { msg: "Deleted." };
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
        // check for missing input
        if (!id) throw new BadRequestError("No id provided.");

        // query db to delete item
        const result = await db.query(
            `DELETE FROM items
            WHERE id = $1
            RETURNING id`,
            [id]
        );
        const removed = result.rows[0];

        // if no record returned, no item found, throw NotFoundError
        if (!removed) throw new NotFoundError(`No item: ${id}`);

        return { msg: "Deleted." };
    }
}

module.exports = Item;
