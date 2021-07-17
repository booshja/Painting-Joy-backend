const db = require("../db");
const { BadRequestError } = require("../expressError");

class Homepage {
    /** Homepage Model */

    static async create(data) {
        /** Create new record for homepage CRM data
         *
         * Accepts data
         *      Data can be: { greeting, message }
         *
         * Returns { id, greeting, message }
         *
         * Throws BadRequestError if no data or missing data
         */
        const keys = Object.keys(data);
        if (keys.length === 0) throw new BadRequestError("No data.");
        if (!data.greeting || !data.message)
            throw new BadRequestError("Missing data.");

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

    static async update(data) {
        /** Delete previous record from db, add updated info
         *
         * Accepts data
         *      Data can be: { greeting, message }
         *
         * Returns { id, greeting, message }
         *
         * Throws BadRequestError if no data or missing data
         *
         * WARNING: This method deletes all the data in the homepages table.
         */
        const keys = Object.keys(data);
        if (keys.length === 0) throw new BadRequestError("No data.");
        if (!data.greeting || !data.message)
            throw new BadRequestError("Missing data.");

        await db.query("DELETE FROM homepages");

        const result = await db.query(
            `INSERT INTO homepages (greeting, message)
            VALUES ($1, $2)
            RETURNING id, greeting, message`,
            [data.greeting, data.message]
        );

        const info = result.rows[0];

        return info;
    }
}

module.exports = Homepage;
