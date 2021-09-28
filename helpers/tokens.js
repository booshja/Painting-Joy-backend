// const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** Return signed JWT from Admin data */
function createAdminToken(user) {
    let payload = {
        isAdmin: user.isAdmin || false,
    };

    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createAdminToken };
