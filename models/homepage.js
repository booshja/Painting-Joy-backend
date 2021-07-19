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
}

module.exports = Homepage;
