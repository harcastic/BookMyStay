import dotenv from "dotenv";
dotenv.config();

import mongoose  from "mongoose";
import initData from "./data.js";
import Listing  from '../models/listing.js';

// const mongo_URL = 'mongodb://127.0.0.1:27017/BookMyStay';
const mongo_URL = process.env.MONGODB_URI;
console.log("MONGODB_URI =", process.env.MONGODB_URI);
async function main() {
    await mongoose.connect(mongo_URL);
    console.log("connected to DB");

    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was added succesfully");
    
    mongoose.connection.close();
}

main();
