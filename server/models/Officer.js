const mongoose = require("mongoose");

// Create Schema for Officer Profile
const OfficerSchema = new mongoose.Schema(
  {
    surname: {
      type: String,
    },
    first: {
      type: String,
    },
    middle: {
      type: String,
    },
    postNom: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    birthStardate: {
      type: String,
    },
    birthPlace: {
      type: String,
    },
    birthDateNote: {
      type: String,
    },
    deathDate: {
      type: Date,
    },
    deathStardate: {
      type: String,
    },
    deathPlace: {
      type: String,
    },
    deathDateNote: {
      type: String,
    },
    serial: {
      type: String,
    },
  },
  { strict: true }
);

module.exports = Officer = mongoose.model("officer", OfficerSchema);
