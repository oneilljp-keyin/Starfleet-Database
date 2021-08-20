const PersonnelDAO = require("../dao/personnelDAO.js");

module.exports = class PersonnelController {
  static async apiGetPersonnel(req, res, next) {
    const personnelPerPage = req.query.personnelPerPage
      ? parseInt(req.query.personnelPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    const db = req.query.db ? req.query.db : "mongo";

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name.toLowerCase();
    }

    const { personnelList, totalNumPersonnel } = await PersonnelDAO.getPersonnel({
      filters,
      page,
      personnelPerPage,
      db,
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
};
