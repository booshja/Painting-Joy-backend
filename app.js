const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

// const { authenticateJWT } = require("./middleware/auth");
const homepageRoutes = require("./routes/homepage");
const messagesRoutes = require("./routes/messages");
const muralsRoutes = require("./routes/murals");
const igPosts = require("./routes/igposts");
const items = require("./routes/items");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("common"));
// app.use(authenticateJWT);

app.use("/homepage", homepageRoutes);
app.use("/messages", messagesRoutes);
app.use("/murals", muralsRoutes);
app.use("/igposts", igPosts);
app.use("/items", items);

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
