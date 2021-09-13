let ranks;
module.exports = class RankDAO {
  static async injectDB(conn) {
    if (ranks) {
      return;
    }
    try {
      ranks = await conn.db(process.env.MONDO_DB_NAME).collection("rank");
    } catch (e) {
      console.error(`Unable to establish a collection handle in rankDAO: ${e}`);
    }
  }

  static async getRankLabels() {
    let rankLabels = [];
    try {
      rankLabels = await ranks.find().sort({ rank_id: 1 }).toArray();
      return rankLabels;
    } catch (e) {
      console.error(`Unable to get rank labels, ${e}`);
      return rankLabels;
    }
  }
};
