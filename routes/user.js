import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import { redirectURL } from '../middleware.js';
import signUp, { getLogout, loginRoute, postLogin, postSignUp } from '../controllers/userController.js'


const router = express.Router();

router.get("/signup" , signUp);

router.post("/signup", wrapAsync( postSignUp ));

router.get("/login", loginRoute);

router.post("/login",  redirectURL, passport.authenticate("local", {failureRedirect: "/login" , failureFlash : true}) , postLogin);

router.get("/logout", getLogout);

export  default router;  