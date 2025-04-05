const express = require("express");
require("dotenv").config()
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
//init db
require("./db/init.mongodb");
//handle errors

//handle routes
app.get("/", (req, res, next) => {
    const strCompress = "Hello hhihiih"
    return res.status(200).json({
        message: "Hello world",
        metadata: strCompress.repeat(1000)
    });
});

module.exports = app;
