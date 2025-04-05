'use strict'

const mongoose = require("mongoose");
const config = require("../configs/config.mongodb")
const connectString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
const { checkConnection, checkOverload } = require("../helper/check.connect")

class Database {

    constructor() {
        this.connect();
    }

    //connect
    connect() {
        mongoose.connect(connectString, {
            maxPoolSize: 50
        })
            .then(() => {
                console.log(connectString)
                console.log("Connected to MongoDB for Pro");
                checkConnection()
                // checkOverload()
            })
            .catch((err) => {
                console.log("Error connecting to MongoDB", err);
    });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
