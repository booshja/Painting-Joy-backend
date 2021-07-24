const db = require("../db");
const format = require("pg-format");
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

    static async getAll() {
        /** Get an array of all the murals
         *
         * Returns [{ id, title, description, isArchived },
         *              { id, title, description, isArchived }, ...]
         */
        // query db for list of all murals
        const result = await db.query(
            `SELECT id,
                    title,
                    description,
                    is_archived AS "isArchived"
                FROM murals`
        );

        return result.rows;
    }

    static async getArchived() {
        /** Get an array of all archived murals
         *
         * Returns [{ id, title, description }, { id, title, description }, ...]
         */
        // query db for list of murals
        const result = await db.query(
            `SELECT id,
                    title,
                    description
                FROM murals
                WHERE is_archived = true`
        );

        return result.rows;
    }

    static async getActive() {
        /** Get an array of all non-archived murals
         *
         * Returns [{ id, title, description }, { id, title, description }, ...]
         */
        // query db for list of murals
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

    static async getImage(muralId, imageName) {
        /** Get image data for a mural by id, imageId
         *
         * Accepts muralId, imageName
         *      muralId should be db ID for mural
         *      imageName should be the name for the image col in db
         *          ie: "image1", "image2", "image3"
         *
         * Returns { image }
         *
         * Throws BadRequestError if missing/incomplete input
         * Throws NotFoundError if no mural
         */
        // check for missing/incomplete input
        if (!muralId && !imageName) throw new BadRequestError("No input.");
        if (!muralId || !imageName) throw new BadRequestError("Missing input.");

        // format query string to prevent sql injection
        const query = format(
            "SELECT %1$I FROM murals WHERE id = %2$s",
            imageName,
            muralId
        );

        // query db to get data
        const result = await db.query(query);
        const muralImg = result.rows[0];

        // if no record returned, no mural found, throw NotFoundError
        if (!muralImg) throw new NotFoundError(`No mural: ${muralId}`);

        return muralImg;
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
        // check for missing/incomplete params
        if (!id && !data) throw new BadRequestError("No input");
        if (!id || !data) throw new BadRequestError("Missing input");

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

        // query db to update mural
        const result = await db.query(querySql, [...values, id]);
        const mural = result.rows[0];

        // if no record returned, no mural found, throw NotFoundError
        if (!mural) throw new NotFoundError(`No mural: ${id}`);

        return mural;
    }

    static async uploadImage(muralId, imageName, data) {
        /** Updates mural with image data
         *
         * Accepts muralId, imageName, data
         *      muralId is db ID for mural
         *      imageName is name of image col in db
         *          ie- "image1", "image2", "image3"
         *      data is image byte string
         *
         * Returns { msg: "Upload successful: image#" }
         *
         * Throws BadRequestError if missing/incomplete input
         * Throws NotFoundError if mural not found
         */
        // check for missing/incomplete inputs
        if (!muralId && !imageName && !data)
            throw new BadRequestError("No input.");
        if (!muralId || !imageName || !data)
            throw new BadRequestError("Missing input.");

        // format query string to prevent sql injection
        const query = format(
            "UPDATE murals SET %1$I = %2$L WHERE id = %3$L RETURNING id",
            imageName,
            data.image,
            muralId
        );

        // query db to get data
        const result = await db.query(query);
        const muralImg = result.rows[0];

        // if no record returned, no mural found, throw NotFoundError
        if (!muralImg) throw new NotFoundError(`No mural: ${muralId}`);

        return { msg: `Upload successful: ${imageName}` };
    }

    static async archive(id) {
        /** Archive mural by id
         *
         * Returns { id, title, description, isArchived }
         *
         * Throws NotFoundError if mural not found
         * Throws BadRequestError if no input
         */
        // check for missing input
        if (!id) throw new BadRequestError("No input");

        // query db to update mural
        const result = await db.query(
            `UPDATE murals
                SET is_archived = true
                WHERE id = $1
                RETURNING id,
                        title,
                        description,
                        is_archived AS "isArchived"`,
            [id]
        );
        const mural = result.rows[0];

        // if no record returned, no mural found, throw NotFoundError
        if (!mural) throw new NotFoundError(`No mural: ${id}`);

        return mural;
    }

    static async unArchive(id) {
        /** UN-Archive mural by id
         *
         * Returns { id, title, description, isArchived }
         *
         * Throws NotFoundError if mural not found
         * Throws BadRequestError if no input
         */
        // check for missing input
        if (!id) throw new BadRequestError("No input");

        // query db to update mural
        const result = await db.query(
            `UPDATE murals
                SET is_archived = false
                WHERE id = $1
                RETURNING id,
                        title,
                        description,
                        is_archived AS "isArchived"`,
            [id]
        );
        const mural = result.rows[0];

        // if no record returned, no mural found, throw NotFoundError
        if (!mural) throw new NotFoundError(`No mural: ${id}`);

        return mural;
    }

    static async deleteImage(muralId, imageName) {
        /** Delete a mural's image by muralId and imageName
         *
         * Accepts muralId, imageName
         *      muralId is db id for mural
         *      imageName is name of image col in db
         *          ie- "image1", "image2", "image3"
         *
         * Returns { msg: "Deleted: image#" }
         *
         * Throws BadRequestError if no id
         * Throws NotFoundError if not found
         */
        // check for missing/incomplete input
        if (!muralId && !imageName) throw new BadRequestError("No input.");
        if (!muralId || !imageName) throw new BadRequestError("Missing input.");

        // format query string to prevent sql injection
        const query = format(
            "UPDATE murals SET %1$I = null WHERE id = %2$L RETURNING id",
            imageName,
            muralId
        );

        // query db to update image data to null
        const result = await db.query(query);
        const mural = result.rows[0];

        // if no record returned, no mural found, throw NotFoundError
        if (!mural)
            throw new NotFoundError(
                `No mural (${muralId}) or invalid image col name (${imageName})`
            );

        return { msg: `Deleted: ${imageName}` };
    }

    static async delete(id) {
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
