import express from 'express';
import mongoose  from 'mongoose';
import path from 'path';
import { fileURLToPath } from "url";
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import listings from './routes/listing.js';
import reviews from './routes/review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const mongo_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/BookMyStay';
const port = process.env.PORT || 8080;

app.engine('ejs', ejsMate);
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

mongoose.set('bufferCommands', false);

// Initialize database connection
let dbConnected = false;
const connectDB = async () => {
    if (dbConnected) return;
    try {
        await mongoose.connect(mongo_URL);
        dbConnected = true;
        console.log("connection established successfully");
    } catch (err) {
        console.log(`error : ${err}`);
    }
};

// Only start server locally, not in Vercel
if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(port, () => {
            console.log(`port is listening on ${port}`);
        });
    });
}

// database connection 
async function main() {
    await mongoose.connect(mongo_URL);
}
mongoose.connection.on("connected", () => {
  console.log("Connected to:", mongoose.connection.name);
});

// Ensure DB connects on each Vercel request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});


//Main Route
app.get("/", (req, res)=>{
    res.send("root site");
})

//Routes 
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Error Handling
app.use((err, req, res, next) => {
    const { status = 500, message = "Internal Server Error" } = err;
    res.status(status).render("error.ejs", {message});
});

export default app;
