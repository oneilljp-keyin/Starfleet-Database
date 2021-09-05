const PersonnelDAO = require("../dao/personnelDAO.js");
const searchHistory = require("../models/SearchHistory");

const ObjectId = require("mongodb").ObjectId;

module.exports = class PersonnelController {
  static async apiGetPersonnel(req, res, next) {
    const personnelPerPage = req.query.personnelPerPage
      ? parseInt(req.query.personnelPerPage, 10)
      : 21;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    const db = req.query.db ? req.query.db : "mongo";
    const userId = req.query.userId;

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name.toLowerCase();
    }

    const { personnelList, totalNumPersonnel } = await PersonnelDAO.getPersonnel({
      filters,
      page,
      personnelPerPage,
      db,
      userId,
    });

    let response = {
      personnel: personnelList,
      page: page,
      filters: filters,
      entries_per_page: personnelPerPage,
      total_results: totalNumPersonnel,
    };
    res.json(response);
  }

  static async apiGetPersonnelById(req, res, next) {
    try {
      const id = req.query.id || {};
      const db = req.query.db ? req.query.db : "mongo";

      let personnel = await PersonnelDAO.getPersonnelById(id, db);
      if (!personnel) {
        res.status(404).json({ error: "Not Found" });
        return;
      }
      res.json(personnel);
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
};
