const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class IGPost {
    /** IGPosts Model */

    static async add(data) {
        /** Add post to db
         *
         * Accepts data
         *      Data should be: { ig_id, caption, perm_url, image_url }
         *
         * Returns { ig_id, caption, perm_url, image_url }
         *
         * Throws BadRequestError if no data or data missing
         */
        // check for missing / incomplete data
        const keys = Object.keys(data);
        if (keys.length === 0) throw new BadRequestError("No data.");
        if (!data.ig_id || !data.caption || !data.perm_url || !data.image_url)
            throw new BadRequestError("Missing data.");

        // query db to create new igpost record
        const result = await db.query(
            `INSERT INTO igposts (ig_id, caption, perm_url, image_url)
            VALUES ($1, $2, $3, $4)
            RETURNING ig_id, caption, perm_url, image_url`,
            [data.ig_id, data.caption, data.perm_url, data.image_url]
        );
        const post = result.rows[0];

        return post;
    }

    static async get(ig_id) {
        /** Get post by ig_id
         *
         * Accepts ig_id
         *
         * Returns { ig_id, caption, perm_url, image_url }
         *
         * Throws NotFoundError if post not found via ig_id
         * Throws BadRequestError if no ig_id
         */
        // check for missing input
        if (!ig_id) throw new BadRequestError("No id provided.");

        // query db for igpost by ig_id
        const result = await db.query(
            `SELECT ig_id,
                    caption,
                    perm_url,
                    image_url
            FROM igposts
            WHERE ig_id = $1`,
            [ig_id]
        );
        const post = result.rows[0];

        // if no record returned, no igpost is found, throw NotFoundError
        if (!post) throw new NotFoundError(`No post found for: ${ig_id}`);

        return post;
    }

    static async getAll() {
        /** Get all posts
         *
         * Returns [{ ig_id, caption, perm_url, image_url },
         *              { ig_id, caption, perm_url, image_url }, ...]
         */
        // query db for list of igposts
        const result = await db.query(
            `SELECT ig_id,
                    caption,
                    perm_url,
                    image_url
            FROM igposts`
        );

        return result.rows;
    }

    static async delete(ig_id) {
        /** Delete post by ig_id
         *
         * Accepts ig_id
         *
         * Returns { msg: "Deleted." }
         *
         * Throws NotFoundError if post not found via ig_id
         * Throw BadRequestError if no input
         */
        // check for missing input
        if (!ig_id) throw new BadRequestError("No input.");

        // query db to delete igpost
        const result = await db.query(
            `DELETE
            FROM igposts
            WHERE ig_id = $1
            RETURNING ig_id`,
            [ig_id]
        );
        const removed = result.rows[0];

        // if no record returned, no igpost found, throw NotFoundError
        if (!removed) throw new NotFoundError(`No post: ${ig_id}`);

        return { msg: "Deleted." };
    }
}

module.exports = IGPost;
