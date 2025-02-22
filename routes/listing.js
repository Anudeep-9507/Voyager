const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

const listingController = require("../controllers/listings.js");

// search route 
router.get("/search", wrapAsync(listingController.searchListings));

router
  .route("/")
  // Index Route
  .get(wrapAsync(listingController.index))
//   Create Route - POST
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  )

// New Route - GET for form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  // Show Route
  .get(wrapAsync(listingController.showListing))
  // Update Route - PUT request
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // Delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route - GET
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.get("/", (req, res) => {
    res.redirect("/listings");
});

module.exports = router;
