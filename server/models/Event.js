const mongoose = require("mongoose");

// Create Schema for event
const EventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    rankLabel: {
      type: String,
    },
    starshipId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    starshipName: {
      type: String,
    },
    starshipRegistry: {
      type: String,
    },
    position: {
      type: String,
    },
    location: {
      type: String,
    },
    starshipId: {
      type: mongoose.Types.ObjectId,
    },
    starshipName: {
      type: String,
    },
    starshipRegistry: {
      type: String,
    },
    date: {
      type: Date,
    },
    dateNote: {
      type: String,
    },
    stardate: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { strict: false }
);

module.exports = LifeEvent = mongoose.model("events", EventSchema);
