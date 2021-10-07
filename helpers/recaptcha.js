const axios = require("axios");

async function validateHuman(token) {
    const secret = process.env.RECAPTCHA_SECRET;

    try {
        const resp = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
        );
        const data = resp.data;

        return process.env.NODE_ENV === "test" ? true : data.success;
    } catch (err) {
        console.log("Recaptcha error: ", err);
    }
}

module.exports = { validateHuman };
