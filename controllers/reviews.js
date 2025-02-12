const Review= require("../models/review");
const Listing= require("../models/listing");
const ExpressError=require("../utils/ExpressError.js");

// create, post route- chat gpt version:
module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.listingId); // Use req.listingId
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    let newReview = new Review(req.body.review);
    newReview.author= req.user._id;
    console.log(newReview); 
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}

// delete route for reviews 
module.exports.destroyReview=async(req,res)=>{
    let {reviewId}=req.params;
    let id = req.listingId;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    res.redirect(`/listings/${id}`);  
}