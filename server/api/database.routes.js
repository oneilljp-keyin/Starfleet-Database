const express = require("express");
const PersonnelCtrl = require("./personnel.controller.js");
const StarshipsCtrl = require("./starships.controller.js");

const router = express.Router();

router.route("/personnel").get(PersonnelCtrl.apiGetPersonnel);
router.route("/personnel/id/").get(PersonnelCtrl.apiGetPersonnelById);

router.route("/starships").get(StarshipsCtrl.apiGetStarships);
router.route("/starships/id/:id").get(StarshipsCtrl.apiGetStarshipById);
router.route("/starships/class").get(StarshipsCtrl.apiGetStarshipClasses);

module.exports = router;
