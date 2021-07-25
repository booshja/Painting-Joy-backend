const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Homepage {
    /** Homepage Model */

    static async create(data) {
        /** Create new record for homepage CRM data
         *
         * Accepts data
         *      Data should be: { greeting, message }
         *
         * Returns { id, greeting, message }
         *
         * Throws BadRequestError if no data or missing data
         */
        // check for missing / incomplete data
        const keys = Object.keys(data);
        if (keys.length === 0) throw new BadRequestError("No data.");
        if (!data.greeting || !data.message)
            throw new BadRequestError("Missing data.");

        // query db for creating new homepage data
        const result = await db.query(
            `INSERT INTO homepages (greeting, message)
            VALUES ($1, $2)
            RETURNING id, greeting, message`,
            [data.greeting, data.message]
        );
        const info = result.rows[0];

        return info;
    }

    static async getData() {
        /** Get the latest record of homepage data
         *
         * Returns { id, greeting, message }
         */
        // query the db for the data
        const result = await db.query(
            `SELECT id,
                    greeting,
                    message
            FROM homepages
            ORDER BY id
            DESC
            LIMIT 1`
        );
        const info = result.rows[0];

        return info;
    }

    static async getImage() {
        /** Get image data for homepage
         *
         * Returns { image }
         *
         * Throws NotFoundError if no homepage found
         * Throws NotFoundError if homepage found, but no image
         */
        // query db to get data
        const result = await db.query(
            `SELECT image
                FROM homepages
                ORDER BY id
                DESC
                LIMIT 1`
        );
        const image = result.rows[0];

        // if no record returned, no homepage found, throw NotFoundError
        if (!image) throw new NotFoundError("No homepage found.");

        // if no image attribute, no image found on homepage, throw NotFoundError
        if (!image.image) throw new NotFoundError("No image found.");

        return image.image;
    }

    static async update(data) {
        /** Delete previous record from db, add updated info
         *
         * Accepts data
         *      Data should be: { greeting, message }
         *
         * Returns { id, greeting, message }
         *
         * Throws BadRequestError if no data or missing data
         *
         * WARNING: This method deletes all the data in the homepages table.
         */
        // check for missing / incomplete data
        if (!data) throw new BadRequestError("No data.");
        if (!data.greeting || !data.message)
            throw new BadRequestError("Missing data.");

        // delete all records from db for homepage
        await db.query("DELETE FROM homepages");

        // query the db to create new homepage data
        const result = await db.query(
            `INSERT INTO homepages (greeting, message)
            VALUES ($1, $2)
            RETURNING id, greeting, message`,
            [data.greeting, data.message]
        );
        const info = result.rows[0];

        return info;
    }

    static async uploadImage(data) {
        /** Updates homepage with image data
         *
         * data can include: { upload }
         *
         * Returns { msg: "Upload successful." }
         *
         * Throws BadRequestError if missing input
         * Throws NotFoundError if homepage not found
         */
        // check for missing/incomplete inputs
        if (!data) throw new BadRequestError("No input.");
        if (!data.image) throw new BadRequestError("No image.");

        // query db to get item id
        const idRes = await db.query(
            `SELECT id
                FROM homepages
                ORDER BY id
                DESC
                LIMIT 1`
        );
        const idObj = idRes.rows[0];

        // if no record returned, no homepage found, throw NotFoundError
        if (!idObj || !idObj.id) throw new NotFoundError("No homepage found.");

        // query db to update homepage with image
        await db.query(
            `UPDATE homepages
                SET image = $1
                WHERE id = $2`,
            [data.image, idObj.id]
        );

        return { msg: "Upload successful." };
    }

    static async deleteImage() {
        /** Deletes a homepage's image
         *
         * Returns { msg: "Deleted." }
         *
         * Throws NotFoundError if no homepage found
         */
        // query db to get homepage id
        const result = await db.query(
            `SELECT id
                FROM homepages
                ORDER BY id
                DESC
                LIMIT 1`
        );
        const id = result.rows[0];

        // if no record returned, no homepage found, throw NotFoundError
        if (!id || !id.id) throw new NotFoundError("No homepage found.");

        // query db to update image to null
        await db.query(
            `UPDATE homepages
                SET image = null
                WHERE id = $1`,
            [id]
        );

        return { msg: "Deleted." };
    }
}

module.exports = Homepage;
