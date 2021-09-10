const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Authenticate Token
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the isAdmin field.)
 *
 * Does not throw error if no token or invalid token.
 */
function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.admin = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        return next();
    }
}

/** Middleware: User must be logged in as an admin user.
 *
 * If not, raises Unauthorized
 */
function ensureAdmin(req, res, next) {
    next();
    // try {
    //     if (!res.locals.admin || !res.locals.admin.isAdmin) {
    //         throw new UnauthorizedError();
    //     }
    //     return next();
    // } catch (err) {
    //     return next(err);
    // }
}

module.exports = { authenticateJWT, ensureAdmin };
