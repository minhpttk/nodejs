const express = require("express");
require("dotenv").config()
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
//init db
require("./db/init.mongodb");
//handle errors

//handle routes
app.use("/", require("./routes"))
module.exports = app;
