const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class IGPosts {
    /** IGPosts Model */

    static async add(data) {
        /** Add post to db
         *
         * Accepts data
         *      Data is: { ig_id, caption, perm_url, image_url }
         *
         * Returns { ig_id, caption, perm_url, image_url }
         *
         * Throws BadRequestError if no data or data missing
         */
        const keys = Object.keys(data);
        if (keys.length === 0) throw new BadRequestError("No data.");
        if (!data.ig_id || !data.caption || !data.perm_url || !data.image_url)
            throw new BadRequestError("Missing data.");

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
        if (!ig_id) throw new BadRequestError("No id provided.");

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

        if (!post) throw new NotFoundError(`No post found for: ${ig_id}`);

        return post;
    }

    static async getAll() {
        /** Get all posts
         *
         * Returns [{ ig_id, caption, perm_url, image_url },
         *              { ig_id, caption, perm_url, image_url }, ...]
         */
        const result = await db.query(
            `SELECT ig_id,
                    caption,
                    perm_url,
                    image_url
            FROM igposts`
        );

        return result.rows;
    }

    static async remove(ig_id) {
        /** Remove post by ig_id
         *
         * Accepts ig_id
         *
         * Returns { msg: "Removed" }
         *
         * ThrowsNotFoundError if post not found via ig_id
         */
        const result = await db.query(
            `DELETE
            FROM igposts
            WHERE ig_id = $1
            RETURNING ig_id`,
            [ig_id]
        );
        const removed = result.rows[0];

        if (!removed) throw new NotFoundError(`No post: ${ig_id}`);

        return { msg: "Removed." };
    }
}

module.exports = IGPosts;
