const multer = require("multer");
const express = require("express");
const app = new express.Router();

// multer options
const upload = multer({
    dest: "images",
});

app.post("/upload", upload.single("upload"), (req, res) => {
    // capture image upload
    res.send();
});
