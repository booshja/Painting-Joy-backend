const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Admin {
    /** Admin Model */

    static async authenticate(username, password) {
        /**Authenticate admin with username, password
         *
         * Accepts username, password
         *
         * Returns { username, firstName, email }
         *
         * Throws UnauthorizedError if user not found or incorrect password
         * Throws BadRequestError if no input or missing input
         */
        // check for no input/missing input
        if (!username && !password) throw new BadRequestError("No input");
        if (!username || !password) throw new BadRequestError("Missing inputs");

        // query db for admin's data
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    email
            FROM admins
            WHERE username = $1`,
            [username]
        );
        const admin = result.rows[0];

        if (admin) {
            // found admin - compare pwd to hashed pwd
            const isValid = await bcrypt.compare(password, admin.password);
            if (isValid === true) {
                delete admin.password;
                admin.isAdmin = true;
                return admin;
            }
        }

        // didn't find admin, throw unauthorized error
        throw new UnauthorizedError("Invalid username/password.");
    }

    static async register(data) {
        /** Register admin with data
         *
         * Accepts data
         *      data should be: { username, password, firstName, email, secretQuestion,
         *                          secretAnswer }
         *
         * Returns { username, firstName, email }
         *
         * Throws BadRequestError on duplicates.
         * Throws BadRequestError if no or missing data
         */
        // check for no data/missing data
        if (!data) throw new BadRequestError("No input.");
        if (
            !data.username ||
            !data.password ||
            !data.firstName ||
            !data.email ||
            !data.secretQuestion ||
            !data.secretAnswer
        )
            throw new BadRequestError("Missing input.");

        // check that there's not already an admin with that username
        const duplicateCheck = await db.query(
            `SELECT username
            FROM admins
            WHERE username = $1`,
            [data.username]
        );
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${data.username}`);
        }

        // hash password and secret answer for new admin
        const hashedPassword = await bcrypt.hash(
            data.password,
            BCRYPT_WORK_FACTOR
        );
        const hashedAnswer = await bcrypt.hash(
            data.secretAnswer,
            BCRYPT_WORK_FACTOR
        );

        // db query to create new admin
        const result = await db.query(
            `INSERT INTO admins
            (username,
                password,
                first_name,
                email,
                secret_question,
                secret_answer)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING username, first_name AS "firstName", email`,
            [
                data.username,
                hashedPassword,
                data.firstName,
                data.email,
                data.secretQuestion,
                hashedAnswer,
            ]
        );
        const admin = result.rows[0];

        return admin;
    }

    static async updatePwd(username, pwd) {
        /** Update Admin password
         *
         * Accepts username, pwd
         * Returns { username, firstName, email }
         *
         * Throws NotFoundError if not found.
         * Throws BadRequestError if no data/missing data
         *
         * WARNING: This function sets a new Admin password.
         * Be certain the admin has validated inputs to this
         * or serious security risks are exposed.
         */
        // check for no input/missing input
        if (!username && !pwd) throw new BadRequestError("No inputs.");
        if (!username || !pwd) throw new BadRequestError("Missing input.");

        // hash password
        const hashedPwd = await bcrypt.hash(pwd, BCRYPT_WORK_FACTOR);

        // query db to update admin password
        const result = await db.query(
            `UPDATE admins
            SET password = $1
            WHERE username = $2
            RETURNING username,
                    first_name AS "firstName",
                    email`,
            [hashedPwd, username]
        );
        const admin = result.rows[0];

        // if no record returned, throw NotFoundError
        if (!admin) throw new NotFoundError("No such admin.");

        // remove password from admin object and return
        delete admin.password;
        return admin;
    }

    static async getSecretQuestion(username) {
        /** Get Admin's Secret Question
         *
         * Accepts username
         * Returns { username, secretQuestion }
         *
         * Throws NotFoundError if admin not found.
         * Throws BadRequestError if no input
         */
        // check for missing input
        if (!username) throw new BadRequestError("No input.");

        // query db for secret question attached to username
        const result = await db.query(
            `SELECT username,
                    secret_question AS "secretQuestion"
            FROM admins
            WHERE username = $1`,
            [username]
        );
        const questionRes = result.rows[0];

        // if no record returned, throw NotFoundError for no admin found
        if (!questionRes) throw new NotFoundError("No such admin.");

        return questionRes;
    }

    static async authenticateSecretAnswer(username, secretAnswer) {
        /** Authenticate Admin Secret Answer
         *
         * Accepts username, secretAnswer
         * Returns { msg: "Valid" }
         *
         * Throws UnauthorizedError if answer is not authenticated.
         * Throws NotFoundError if admin not found.
         */
        // Check for missing / incomplete data
        if (!username && !secretAnswer) throw new BadRequestError("No input.");
        if (!username || !secretAnswer)
            throw new BadRequestError("Missing input.");

        // query db for secret answer
        const result = await db.query(
            `SELECT username,
                    secret_answer AS "secretAnswer"
            FROM admins
            WHERE username = $1`,
            [username]
        );
        const admin = result.rows[0];

        if (admin) {
            // compare hashed secret answer to a new hash from secretAnswer
            const isValid = await bcrypt.compare(
                secretAnswer,
                admin.secretAnswer
            );
            if (isValid === true) {
                return { msg: "Valid" };
            } else {
                throw new UnauthorizedError("Invalid secret answer.");
            }
        }

        // no admin found, throw Not Found Error
        throw new NotFoundError("No such admin.");
    }
}

module.exports = Admin;
