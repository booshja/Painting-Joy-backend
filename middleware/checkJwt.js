const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;

// middleware for authenticating auth0 JWT's
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://paintingjoy.us.auth0.com/.well-known/jwks.json`,
    }),
    audience: audience,
    issuer: `https://${domain}/`,
    algorithms: ["RS256"],
});

module.exports = checkJwt;
