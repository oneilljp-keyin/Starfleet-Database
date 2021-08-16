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

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const text = req.body.text;
      const date = new Date();

      const reviewResponse = await StarshipsDAO.updateReview(
        reviewId,
        req.body.user_id,
        text,
        date
      );

      var { error } = reviewResponse;
      if (error) {
        res.status(400).json({ error });
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error("Unable to update review - user may not be original poster");
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query.id;
      const userId = req.body.user_id;
      const reviewResponse = await StarshipsDAO.deleteReview(reviewId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
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
