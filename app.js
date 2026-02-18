import express from 'express';
import mongoose  from 'mongoose';
import path from 'path';
import { fileURLToPath } from "url";
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import listingRouters from './routes/listing.js';
import reviewRouters from './routes/review.js';
import userRouter from './routes/user.js';
import session  from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';


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

const sessionOptions = {
    secret : "MySecretkey4kj5djhs5",
    resave : false,
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    } ,
}
app.use(session(sessionOptions));
app.use(flash());

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH MIDDLEWARE
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

mongoose.set('bufferCommands', false);

// Initialize database connection
const connectDB = async () => {
    try {
        await mongoose.connect(mongo_URL);
        console.log("connection established successfully");
    } catch (err) {
        console.log(`error : ${err}`);
        setTimeout(connectDB, 5000);
    }
};

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`port is listening on ${port}`);
    });
});

mongoose.connection.on("connected", () => {
  console.log("Connected to:", mongoose.connection.name);
});


//Main Route
app.get("/", (req, res)=>{
    // res.redirect("/listings");
    res.send("home page");
    
})

//Routes 
app.use("/listings", listingRouters);
app.use("/listings/:id/reviews", reviewRouters);
app.use("/", userRouter);

// Error Handling
app.use((err, req, res, next) => {
    const { status = 500, message = "Internal Server Error" } = err;
    res.status(status).render("error.ejs", {message});
});

export default app;
