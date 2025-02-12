const Listing= require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// search route 
module.exports.searchListings = async (req, res) => {
    const { title } = req.query; // Get the search query from the URL
    if (!title) {
      return res.redirect("/listings"); // Redirect if no search term is provided
    }
    try {
      const listings = await Listing.find({ title: { $regex: title, $options: "i" } }); // Case-insensitive search
      res.render("listings/index", { allListings: listings }); // Render the listings page with search results
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

// Index Route 
module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

// New Route - GET for form 
module.exports.renderNewForm=(req,res)=>{
    // middleware is defined in middleware.js  
    res.render("listings/new.ejs");
}

// Show Route 
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({path:"reviews",
        populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
    console.log(listing);
}

//Create Route - POST
module.exports.createListing=async (req,res,next)=>{
  let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
    .send()

    let url=req.file.path;
    let filename=req.file.filename;  

    const newListing= await Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
   let savedListings= newListing.geometry=response.body.features[0].geometry;
   console.log(savedListings);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

// Edit Route - GET
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

// Update Route - PUT request
module.exports.updateListing=async (req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){   
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

// Delete Route 
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}


