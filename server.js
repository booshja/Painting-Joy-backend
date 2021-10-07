const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, () => {
    // start server listening on port provided
    console.log(`Server Listening`);
});
