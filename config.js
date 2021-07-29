require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "this-is-secret";
const PORT = +process.env.PORT || 3001;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_TO = process.env.EMAIL_TO;

/** Determine which db to use via ENV */
function getDatabaseUri() {
    return process.env.NODE_ENV === "test"
        ? "pj_test"
        : process.env.DATABASE_URL || "paintingjoy";
}

/** Bcrypt work factor (1 if testing application) */
const BCRYPT_WORK_FACTOR =
    process.env.NODE_ENV === "test" ? 1 : +process.env.BCRYPT_WORK_FACTOR;

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    SENDGRID_API_KEY,
    EMAIL_FROM,
    EMAIL_TO,
    getDatabaseUri,
};
