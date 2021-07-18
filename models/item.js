const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Item {
    /** Item Model */

    static async create(data) {
        /** Create an item (from data), update db, return new item
         *
         * Data should be: { name, description, price, quantity, created,
         *                      isArchived, isSold }
         *
         * Returns: { id, name, description, price, quantity, created,
         *                      isArchived, isSold }
         *
         * Throws BadRequestError if incomplete or no data
         */
    }

    static async get(id) {
        /** Get an item by id
         *
         * Accepts id
         *
         * Returns { id, name, description, price, quantity, created,
         *                      isArchived, isSold }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if no item found by id
         */
    }

    static async getAll() {
        /** Gets an array of items
         *
         * Returns [{ id, name, description, price, quantity, created,
         *              isArchived, isSold }, { id, name, description,
         *              price, quantity, created, isArchived, isSold }, ...]
         */
    }

    static async getAllActive() {
        /** Gets an array of items that are NOT archived
         *
         * Returns [{ id, name, description, price, quantity, created },
         *              { id, name, description, price, quantity, created }, ...]
         */
    }

    static async getAllArchived() {
        /** Gets an array of items that ARE archived
         *
         * Returns [{ id, name, description, price, quantity, created },
         *              { id, name, description, price, quantity, created }, ...]
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
         * Returns: { id, name, description, price, quantity, created, isArchived,
         *              isSold }
         *
         * Throws BadRequestError if no data
         * Throws NotFoundError if no item found
         */
    }

    static async archive(id) {
        /** Mark item as archived by id
         *
         * Accepts id
         *
         * Returns: { id, name, description, price, quantity, created, isArchived,
         *              isSold }
         */
    }

    static async markSold(id) {
        /** Mark item as sold by id
         *
         * Accepts id
         *
         * Returns: { id, name, description, price, quantity, created, isArchived,
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
