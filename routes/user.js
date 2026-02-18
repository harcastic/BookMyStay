import express from 'express';
import User from '../models/user.js';
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import { redirectURL } from '../middleware.js';
// import { redirectURL  from '../middleware.js';
const router = express.Router();

router.get("/signup" , (req, res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync( async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to BookMyStay");
            res.redirect("/listings");
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));


router.get("/login", (req, res)=>{
    res.render("users/login.ejs");
})

router.post("/login",  redirectURL, passport.authenticate("local", {failureRedirect: "/login" , failureFlash : true}) , async(req,res)=>{
    req.flash("success" , "Welcome to BookMyStay"); 
    let redirectRoute = res.locals.redirectRoute || "/listings";
    res.redirect(redirectRoute);
});


router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "logged out successfully");
        res.redirect("/listings");
    })
})

export  default router;  