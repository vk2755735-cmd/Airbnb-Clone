const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  image: {
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    filename: String,
  },

  price: {
    type: Number,
    min: 0,
    required: true,
  },

  location: {
    type: String,
    required: true,
    trim: true,
  },

  country: {
    type: String,
    required: true,
    trim: true,
  },

  // 🌍 GeoJSON (FINAL & SAFE)
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (val) {
          return val.length === 2;
        },
        message: "Coordinates must be [longitude, latitude]",
      },
      default: [77.2090, 28.6139], // Delhi fallback
    },
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// ✅ Geospatial index (MUST for maps)
listingSchema.index({ geometry: "2dsphere" });

// 🗑 Auto delete reviews when listing deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
