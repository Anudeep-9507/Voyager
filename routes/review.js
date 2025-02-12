const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js")

// create, post route- chat gpt version:
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// delete route for reviews 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;



// post route 
// router.post("/",validateReview,wrapAsync(async(req,res)=>{
    // let listing = await Listing.findById(req.params.id);
//     let listing = await Listing.findById(req.listingId);
//     let newReview=new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await listing.save();
//     await newReview.save();
//     res.redirect(`/listings/${listing._id}`);
// }));

