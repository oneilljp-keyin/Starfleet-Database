const RankDAO = require("../dao/rankDAO.js");

module.exports = class RankController {
  static async apiGetRankLabels(req, res, next) {
    try {
      let rankLabels = await RankDAO.getRankLabels();
      res.json(rankLabels);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
};
