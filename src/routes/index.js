const express = require("express");
const router = express.Router();

router.get("/",(reg,res) => {
    res.send("Hello World");
});

module.exports = router;