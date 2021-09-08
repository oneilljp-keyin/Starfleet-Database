const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

// Create Schema for starship
const UserSchema = new mongoose.Schema(
  {
    ship_id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    registry: {
      type: String,
      unique: true,
    },
    class: {
      type: String,
    },
    launch: [
      {
        date: {
          type: Date,
        },
        stardate: {
          type: String,
        },
        note: {
          type: String,
        },
      },
    ],
    commission: [
      {
        date: {
          type: Date,
        },
        stardate: {
          type: String,
        },
        note: {
          type: String,
        },
      },
    ],
    decommission: [
      {
        date: {
          type: Date,
        },
        stardate: {
          type: String,
        },
        note: {
          type: String,
        },
      },
    ],
    destruction: [
      {
        date: {
          type: Date,
        },
        stardate: {
          type: String,
        },
        note: {
          type: String,
        },
      },
    ],
    photo: {
      type: Buffer,
    },
  },

  { strict: false }
);

module.exports = User = mongoose.model("users", UserSchema);
