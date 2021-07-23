const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Mural {
    /** Mural Model */

    static async create(data) {
        /** Create a mural (from data), update db, return new mural data
         *
         * Data should be { title, description }
         *
         * Returns { id, title, description, photo1, photo2, photo3, isArchived }
         *
         * Throws BadRequestError for missing / incomplete data
         */
        // check for missing / incomplete data
        if (!data) throw new BadRequestError("No input.");
        if (!data.title || !data.description)
            throw new BadRequestError("Missing data.");

        // query db to create new mural
        const result = await db.query(
            `INSERT INTO murals (title,
                                description)
                VALUES ($1, $2)
                RETURNING id,
                        title,
                        description,
                        is_archived AS "isArchived"`,
            [data.title, data.description]
        );
        const mural = result.rows[0];

        return mural;
    }

    // static async addImage(data) {
    //     /** Add an image to a mural (from data), update db, return new mural data */
    // }

    static async getAll() {
        /** Get an array of all the murals
         *
         * Returns [{ id, title, description }, { id, title, description }, ...]
         */
        // query db for list of all murals
        const result = await db.query(
            `SELECT id,
                    title,
                    description
            FROM murals
            WHERE is_archived = false`
        );

        return result.rows;
    }

    static async get(id) {
        /** Get a single mural
         *
         * Accepts id
         * Returns { id, title, description }
         *
         * Throws NotFoundError if not found.
         */
        // check for missing input
        if (!id) throw new BadRequestError("No input");

        // query db to get mural by id
        const result = await db.query(
            `SELECT id,
                    title,
                    description
            FROM murals
            WHERE id = $1`,
            [id]
        );
        const mural = result.rows[0];

        // if no record returned, no mural found, throw NotFoundError
        if (!mural) throw new NotFoundError(`No mural: ${id}`);

        return mural;
    }

    static async update(id, data) {
        /** Update mural data with 'data'
         * This is a partial update, only the fields provided are changed.
         *
         * Data can include: { title, description }
         *
         * Returns { id, title, description }
         *
         * Throws NotFoundError if not found.
         */
        // prepare data for partial update
        const { setCols, values } = sqlForPartialUpdate(data, {});
        const idVarIdx = "$" + (values.length + 1);

        // prepare sql query statement for partial update
        const querySql = `UPDATE murals
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING id,
                                    title,
                                    description`;
        const result = await db.query(querySql, [...values, id]);
        const mural = result.rows[0];

        // query db to update item
        if (!mural) throw new NotFoundError(`No mural: ${id}`);

        return mural;
    }

    static async remove(id) {
        /** Delete mural data
         *
         * Throws NotFoundError if mural not found.
         */
        // check for missing input
        if (!id) throw new BadRequestError("No input.");

        // query db to delete mural
        const result = await db.query(
            `DELETE
            FROM murals
            WHERE id = $1
            RETURNING id`,
            [id]
        );
        const removed = result.rows[0];

        // if no record returned, no mural found, throw NotFoundError
        if (!removed) throw new NotFoundError(`No mural: ${id}`);

        return { msg: "Deleted." };
    }
}

module.exports = Mural;
