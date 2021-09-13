const express = require("express");
const PersonnelCtrl = require("./personnel.controller.js");
const RankCtrl = require("./rank.controller.js");
const StarshipsCtrl = require("./starships.controller.js");

const router = express.Router();

router.route("/personnel").get(PersonnelCtrl.apiGetPersonnel);
router.route("/personnel/id/").get(PersonnelCtrl.apiGetPersonnelById);
router.route("/personnel/history/:id").get(PersonnelCtrl.apiGetSearchHistory);
router.route("/personnel/ranks").get(RankCtrl.apiGetRankLabels);

router.route("/starships").get(StarshipsCtrl.apiGetStarships);
router.route("/starships/id/").get(StarshipsCtrl.apiGetStarshipById);
router.route("/starships/classes").get(StarshipsCtrl.apiGetStarshipClasses);

module.exports = router;
