const mongoose = require("mongoose");

// Create Schema for searchHistory
const SearchHistorySchema = new mongoose.Schema(
  {
    searchString: {
      type: String,
      required: true,
      trim: true,
    },
    cateogory: {
      type: String,
      required: true,
      validate(value) {
        if (value.toLowerCase() !== "starship" || value.toLowerCase() !== "personnel")
          throw new Error("category must be Personnel or Starship");
      },
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
