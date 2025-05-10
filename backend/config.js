const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config();

const uri = process.env.MONGO_URI;

const client = mongoose.createConnection(uri)

module.exports = client;