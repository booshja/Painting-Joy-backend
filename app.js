const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("common"));

/** Handle 404 Errors */
app.use((req, res, next) => {
    return next(new NotFoundError());
});

/** Generic error handler */
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;
