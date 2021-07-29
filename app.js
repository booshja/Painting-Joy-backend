const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const axios = require("axios");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const homepageRoutes = require("./routes/homepage");
const igPostsRoutes = require("./routes/igposts");
const itemsRoutes = require("./routes/items");
const messagesRoutes = require("./routes/messages");
const muralsRoutes = require("./routes/murals");
const { router: ordersRoutes } = require("./routes/orders");

const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("common"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/homepage", homepageRoutes);
app.use("/igposts", igPostsRoutes);
app.use("/items", itemsRoutes);
app.use("/messages", messagesRoutes);
app.use("/murals", muralsRoutes);
app.use("/orders", ordersRoutes);

app.post("/verify", async (req, res, next) => {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body["g-recaptcha-response"]}`;
    const result = await axios.post(verifyUrl);
    return res.status(200).json(result.data);
});

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
