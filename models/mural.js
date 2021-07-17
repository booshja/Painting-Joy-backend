const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Mural {
    /** Mural Model */

    static async create(data) {
        /** Create a mural (from data), update db, return new mural data
         *
         * Data should be { title, description, price }
         *
         * Returns { id, title, description, price, photo1, photo2, photo3, isArchived }
         */
        const result = await db.query(
            `INSERT INTO murals (title,
                                description,
                                price,
                                is_archived,
                                is_deleted)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, title, description, price, is_archived AS "isArchived"`,
            [data.title, data.description, data.price, false, false]
        );
        const mural = result.rows[0];

        return mural;
    }

    // static async addImage(data) {
    //     /** Add an image to a mural (from data), update db, return new mural data */
    // }

    static async getAll() {
        const result = await db.query(
            `SELECT id,
                    title,
                    description,
                    price
            FROM murals
            WHERE is_archived = false
            AND is_deleted = false`
        );

        return result.rows;
    }

    static async get(id) {
        /** Get a single mural
         *
         * Accepts id
         * Returns { id, title, description, price }
         *
         * Throws NotFoundError if not found.
         */
        const muralRes = await db.query(
            `SELECT id,
                    title,
                    description,
                    price
            FROM murals
            WHERE id = $1`,
            [id]
        );

        const mural = muralRes.rows[0];

        if (!mural) throw new NotFoundError(`No mural: ${id}`);

        return mural;
    }

    static async update(id, data) {
        /** Update mural data with 'data'
         * This is a partial update, only the fields provided are changed.
         *
         * Data can include: { title, description, price }
         *
         * Returns { id, title, description, price }
         *
         * Throws NotFoundError if not found.
         */
        const { setCols, values } = sqlForPartialUpdate(data, {});
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE murals
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING id,
                                    title,
                                    price`;
        const result = await db.query(querySql, [...values, id]);
        const mural = result.rows[0];

        if (!mural) throw new NotFoundError(`No mural: ${id}`);

        return mural;
    }

    static async remove(id) {
        /** Delete mural data
         *
         * Throws NotFoundError if mural not found.
         */
        const result = await db.query(
            `DELETE
            FROM murals
            WHERE id = $1
            RETURNING id`,
            [id]
        );
        const removed = result.rows[0];

        if (!removed) throw new NotFoundError(`No mural: ${id}`);

        return { msg: "Deleted." };
    }
}

module.exports = Mural;
