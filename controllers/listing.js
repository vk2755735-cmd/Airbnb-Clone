const Listing = require("../models/listing");

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  // Owner
  newListing.owner = req.user._id;

  // Image (Cloudinary)
  if (req.file) {
    newListing.image = {
      url: req.file.path,      // Cloudinary URL
      filename: req.file.filename,
    };
  }

  // Geometry (latitude/longitude)
  const { latitude, longitude } = req.body.listing;
  if (latitude && longitude) {
    newListing.geometry = {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image?.url;
  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); // thumbnail version
  }

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Update basic fields
  Object.assign(listing, req.body.listing);

  // Update image if a new one is uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // Preserve geometry or fallback
  if (!listing.geometry) {
    listing.geometry = {
      type: "Point",
      coordinates: [77.2090, 28.6139], // Delhi fallback
    };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};


