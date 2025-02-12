if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
// local database
// const MONGO_URL='mongodb://....../wanderlust';  
const dbUrl=process.env.ATLASDB_URL;

const express= require("express");
const app = express();
const mongoose= require("mongoose");
exports.MONGO_URL = dbUrl;
const path=require("path");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");    
const { valid } = require("joi");
const session=require("express-session");
const MongoStore= require("connect-mongo");
const flash=require("connect-flash");   
const passport = require("passport");   
const LocalStrategy = require("passport-local");
const User= require("./models/user.js");

const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>console.log(err));

// change from MONGO_URL of local system to dbUrl of mongo cloud
async function main() {
    try {
        await mongoose.connect(dbUrl); o
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
    }
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

// creating a session object 
const sessionObject={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}

app.use(session(sessionObject));
app.use(flash());

// passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.listen(8080,()=>{
    console.log('listening to port 8080');
})

app.use("/listings",listingRouter);

// app.use("/listings/:id/reviews",reviews);
app.use("/listings/:id/reviews", (req, res, next) => {
    req.listingId = req.params.id; // Pass `id` manually to the child router
    next();
}, reviewRouter);
app.use("/",userRouter);

// custom ExpressError 
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

// middleware for error handling 
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{message});
})

console.log("MongoDB URL:", process.env.ATLASDB_URL);

