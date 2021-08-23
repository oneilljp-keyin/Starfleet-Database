const mongoose = require("mongoose");

// Create Schema for searchHistory
const SearchHistorySchema = new mongoose.Schema(
  {
    searchString: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { strict: false }
);

module.exports = SearchHistory = mongoose.model("searchHistory", SearchHistorySchema);
