const StarshipsDAO = require("../dao/starshipsDAO.js");

module.exports = class StarshipsController {
  static async apiGetStarships(req, res, next) {
    const starshipsPerPage = req.query.starshipsPerPage
      ? parseInt(req.query.StarshipsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name;
    }

    const { starshipsList, totalNumStarships } = await StarshipsDAO.getStarships({
      filters,
      page,
      starshipsPerPage,
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
      let id = req.params.id || {};
      let starship = await starshipDAO.getStarshipById(id);
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
