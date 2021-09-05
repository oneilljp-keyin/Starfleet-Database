const StarshipsDAO = require("../dao/starshipsDAO.js");
const searchHistory = require("../models/SearchHistory");

const ObjectId = require("mongodb").ObjectId;

module.exports = class Controller {
  static async apiGetStarships(req, res, next) {
    const starshipsPerPage = req.query.starshipsPerPage
      ? parseInt(req.query.starshipsPerPage, 10)
      : 21;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    const db = req.query.db ? req.query.db : "mongo";
    const userId = req.query.userId;

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name.toLowerCase();
    } else if (req.query.class) {
      filters.class = req.query.class;
    }

    const { starshipsList, totalNumStarships } = await StarshipsDAO.getStarships({
      filters,
      page,
      starshipsPerPage,
      db,
      userId,
    });

    let response = {
      starships: starshipsList,
      page: page,
      filters: filters,
      entries_per_page: starshipsPerPage,
      total_results: totalNumStarships,
    };
    res.json(response);
  }

  static async apiGetStarshipById(req, res, next) {
    try {
      const id = req.query.id || {};
      const db = req.query.db ? req.query.db : "mongo";

      let starship = await StarshipsDAO.getStarshipById(id, db);
      if (!starship) {
        res.status(404).json({ error: "Not Found" });
        return;
      }
      res.json(starship);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetSearchHistory(req, res, next) {
    let o_id = new ObjectId(req.param.id);
    console.log(o_id);
    try {
      const history = await searchHistory.find({ userId: o_id });
      console.log(history);
      res.send(history);
    } catch (err) {
      res.json(err.message);
    }
  }

  static async apiGetStarshipClasses(req, res, next) {
    try {
      let classes = await StarshipsDAO.getClasses();
      res.json(classes);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
};
