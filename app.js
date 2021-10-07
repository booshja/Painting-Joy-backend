const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// errors
const { NotFoundError } = require("./expressError");

// routes
const homepageRoutes = require("./routes/homepage");
const igPostsRoutes = require("./routes/igposts");
const itemsRoutes = require("./routes/items");
const messagesRoutes = require("./routes/messages");
const muralsRoutes = require("./routes/murals");
const { router: ordersRoutes } = require("./routes/orders");

// logging
const morgan = require("morgan");

// express instance
const app = express();

// express use
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000/" }));
app.use(express.json());
app.use(morgan("common"));

// express routes
app.use("/homepage", homepageRoutes);
app.use("/igposts", igPostsRoutes);
app.use("/items", itemsRoutes);
app.use("/messages", messagesRoutes);
app.use("/murals", muralsRoutes);
app.use("/orders", ordersRoutes);

/** Handle 404 Errors */
app.use((req, res, next) => {
    return next(new NotFoundError("Endpoint not found."));
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
