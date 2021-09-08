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
    birth: [
      {
        date: {
          type: Date,
        },
        stardate: {
          type: String,
        },
        place: {
          type: String,
        },
        note: {
          type: String,
        },
      },
    ],
    death: [
      {
        date: {
          type: Date,
        },
        stardate: {
          type: String,
        },
        place: {
          type: String,
        },
        note: {
          type: String,
        },
      },
    ],
    serial: {
      type: String,
    },
  },
  { strict: false }
);

module.exports = Officer = mongoose.model("personnel", PersonnelSchema);
