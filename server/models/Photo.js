const mongoose = require("mongoose");

const PhotoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },

    image: {
      type: Buffer,
      required: true,
    },
    file_mimetype: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model("photo", PhotoSchema);

module.exports = Photo;
