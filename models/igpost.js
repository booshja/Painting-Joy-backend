const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class IGPost {
    /** IGPosts Model */

    static async add(data) {
        /** Add post to db
         *
         * Accepts data
         *      Data should be: { igId, caption, permUrl, imageUrl }
         *
         * Returns { igId, caption, permUrl, imageUrl }
         *
         * Throws BadRequestError if no data or data missing
         */
        // check for missing / incomplete data
        const keys = Object.keys(data);
        if (keys.length === 0) throw new BadRequestError("No data.");
        if (!data.igId || !data.caption || !data.permUrl || !data.imageUrl)
            throw new BadRequestError("Missing data.");

        // query db to create new igpost record
        const result = await db.query(
            `INSERT INTO igposts (ig_id,
                                caption,
                                perm_url,
                                image_url)
                VALUES ($1, $2, $3, $4)
                RETURNING ig_id AS "igId",
                        caption,
                        perm_url AS "permUrl",
                        image_url AS "imageUrl"`,
            [data.igId, data.caption, data.permUrl, data.imageUrl]
        );
        const post = result.rows[0];

        return post;
    }

    static async get(igId) {
        /** Get post by igId
         *
         * Accepts igId
         *
         * Returns { igId, caption, permUrl, imageUrl }
         *
         * Throws NotFoundError if post not found via igId
         * Throws BadRequestError if no igId
         */
        // check for missing input
        if (!igId) throw new BadRequestError("No id provided.");

        // query db for igpost by igId
        const result = await db.query(
            `SELECT ig_id AS "igId",
                    caption,
                    perm_url AS "permUrl",
                    image_url AS "imageUrl"
            FROM igposts
            WHERE ig_id = $1`,
            [igId]
        );
        const post = result.rows[0];

        // if no record returned, no igpost is found, throw NotFoundError
        if (!post) throw new NotFoundError(`No post found for: ${igId}`);

        return post;
    }

    static async getAll() {
        /** Get all posts
         *
         * Returns [{ igId, caption, permUrl, imageUrl },
         *              { igId, caption, permUrl, imageUrl }, ...]
         */
        // query db for list of igposts
        const result = await db.query(
            `SELECT ig_id AS "igId",
                    caption,
                    perm_url AS "permUrl",
                    image_url AS "imageUrl"
            FROM igposts`
        );

        return result.rows;
    }

    static async delete(igId) {
        /** Delete post by igId
         *
         * Accepts igId
         *
         * Returns { msg: "Deleted." }
         *
         * Throws NotFoundError if post not found via igId
         * Throw BadRequestError if no input
         */
        // check for missing input
        if (!igId) throw new BadRequestError("No input.");

        // query db to delete igpost
        const result = await db.query(
            `DELETE
            FROM igposts
            WHERE ig_id = $1
            RETURNING ig_id AS "igId"`,
            [igId]
        );
        const removed = result.rows[0];

        // if no record returned, no igpost found, throw NotFoundError
        if (!removed) throw new NotFoundError(`No post: ${igId}`);

        return { msg: "Deleted." };
    }
}

module.exports = IGPost;
