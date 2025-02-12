const User=require("../models/user.js");   

// GET - signup form 
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

// POST - signup 
module.exports.signup=async(req,res)=>{
    try{
        let {username, email, password}=req.body;
        let newUser=new User({username,email});
       const registeredUser= await User.register(newUser, password);
       console.log(registeredUser);
       req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
       });
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

// GET - login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

// POST- login (using authentication of passport)
module.exports.login=(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";  
    res.redirect(redirectUrl);
}

// GET request for logout 
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    })
};