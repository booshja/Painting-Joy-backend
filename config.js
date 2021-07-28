require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "this-is-secret";
const PORT = +process.env.PORT || 3001;

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
    getDatabaseUri,
};
