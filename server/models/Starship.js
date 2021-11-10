const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

// Create Schema for starship
const StarshipSchema = new mongoose.Schema(
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
    launch_date: {
      type: Date,
    },
    lauch_stardate: {
      type: String,
    },
    launch_note: {
      type: String,
    },
    commission_date: {
      type: Date,
    },
    commission_stardate: {
      type: String,
    },
    commission_note: {
      type: String,
    },
    decommission_date: {
      type: Date,
    },
    decommission_stardate: {
      type: String,
    },
    decommission_note: {
      type: String,
    },
    destruction_date: {
      type: Date,
    },
    destruction_stardate: {
      type: String,
    },
    destruction_note: {
      type: String,
    },
  },

  { strict: false }
);

module.exports = Starship = mongoose.model("starships", StarshipSchema);
