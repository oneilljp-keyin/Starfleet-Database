const Photo = require("../models/Photo");

module.exports = class PhotosDAO {
  static async getOfficerPhotos() {
    let officerPhotos = [];
    try {
      rankLabels = await ranks.find().sort({ rank_id: 1 }).toArray();
      return rankLabels;
    } catch (e) {
      console.error(`Unable to get rank labels, ${e}`);
      return rankLabels;
    }
  }

  static async getOfficerPhotos() {
    let officerPhotos = [];
    try {
      rankLabels = await ranks.find().sort({ rank_id: 1 }).toArray();
      return rankLabels;
    } catch (e) {
      console.error(`Unable to get rank labels, ${e}`);
      return rankLabels;
    }
  }
};
