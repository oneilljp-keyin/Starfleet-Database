const mongoose = require("mongoose");

const PhotoSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model("photo", PhotoSchema);

module.exports = Photo;
