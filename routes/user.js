const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport"); 
const { isRef } = require("joi");
const {saveRedirectUrl} = require("../middleware.js");

const userController=require("../controllers/users.js");

router
    .route("/signup")
    // GET - signup form 
    .get(userController.renderSignupForm)
    // POST - signup 
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    // GET - login form
    .get(userController.renderLoginForm)
    // POST- login (using authentication of passport)
    .post(
        saveRedirectUrl,
        passport.authenticate(
        "local",
        {failureFlash:true,
        failureRedirect:"/login"}),userController.login);
    
// GET request for logout 
router.get("/logout",userController.logout);

module.exports=router;   