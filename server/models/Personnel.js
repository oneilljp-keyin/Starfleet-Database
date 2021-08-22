const mongoose = require("mongoose");

// Create Schema for Officer Profile
const PersonnelSchema = new mongoose.Schema(
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
    dob: {
      type: Date,
    },
    dob_note: {
      type: String,
    },
    dod: {
      type: Date,
    },
    dod_note: {
      type: String,
    },
    dod: {
      type: Date,
    },
    serial: {
      type: String,
    },
  },
  { strict: false }
);

module.exports = Officer = mongoose.model("personnel", PersonnelSchema);
