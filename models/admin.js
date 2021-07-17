const db = require("../db");
const bcrypt = require("bcrypt");
const { NotFoundError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Admin {
    /** Admin Model */

    static async authenticate(username, password) {
        /**
         * Authenticate admin with username, password
         *
         * Accepts username, password
         * Returns { username, firstName, email }
         *
         * Throws UnauthorizedError if user not found
         * or incorrect password
         */

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
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete admin.password;
                return admin;
            }
        }

        // didn't find admin, throw unauthorized error
        throw new UnauthorizedError("Invalid username/password.");
    }

    static async updatePwd(username, pwd) {
        /** Update Admin password
         *
         * Accepts username, pwd
         * Returns { username, firstName, email }
         *
         * Throws NotFoundError if not found.
         *
         * WARNING: This function sets a new Admin password.
         * Be certain the admin has validated inputs to this
         * or serious security risks are exposed.
         */

        // get hashed password
        const hashedPwd = await bcrypt.hash(pwd, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `UPDATE users
            SET password = $1
            WHERE username = $2
            RETURNING username,
                    first_name AS "firstName",
                    email`,
            [hashedPwd, username]
        );
        const admin = result.rows[0];

        if (!admin) throw new NotFoundError("No such admin.");

        delete admin.password;
        return admin;
    }

    static async getSecretQuestion(username) {}

    static async authenticateSecretAnswer(username, secretAnswer) {
        /** Authenticate Admin Secret Answer
         *
         * Accepts username, secretAnswer
         * Returns { msg: "Valid" }
         *
         * Throws Unauthorized Error if answer is not authenticated.
         * Throws Not Found Error if admin not found.
         */

        const hashedAnswer = await bcrypt.hash(
            secretAnswer,
            BCRYPT_WORK_FACTOR
        );

        const result = await db.query(
            `SELECT username,
                    secret_answer
            FROM admins
            WHERE username = $1`,
            [username]
        );
        const admin = result.rows[0];

        if (admin) {
            // compare hashed secret answer to a new hash from secretAnswer
            const isValid = await bcrypt.compare(
                hashedAnswer,
                BCRYPT_WORK_FACTOR
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
