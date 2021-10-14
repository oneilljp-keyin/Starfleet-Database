const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const PersonnelCtrl = require("./personnel.controller.js");
const RankCtrl = require("./rank.controller.js");
const StarshipsCtrl = require("./starships.controller.js");
const EventsCtrl = require("./events.controller.js");

const Photo = require("../models/Photo");

const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 1048576, // max file size 1MB = 1048576 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg||JPEG|jpg|JPG|png|PNG)$/)) {
      return cb(new Error("only upload files with jpg, jpeg, png format."));
    }
    cb(undefined, true); // continue with upload
  },
});

router.route("/personnel").get(PersonnelCtrl.apiGetPersonnel);
router
  .route("/personnel/id/")
  .get(PersonnelCtrl.apiGetPersonnelById)
  .patch(PersonnelCtrl.apiUpdatePersonnel);
router.route("/personnel/ranks").get(RankCtrl.apiGetRankLabels);
router.route("/personnel/events").get(EventsCtrl.apiGetAllEvents);
router.route("/personnel/photos").get(PersonnelCtrl.apiGetOfficerPhotos);
router
  .route("/personnel/event")
  .get(EventsCtrl.apiGetEventById)
  .post(EventsCtrl.apiAddLifeEvent)
  .patch(EventsCtrl.apiUpdateLifeEvent);

router.route("/starships").get(StarshipsCtrl.apiGetStarships);
router.route("/starships/id/").get(StarshipsCtrl.apiGetStarshipById);
router.route("/starships/classes").get(StarshipsCtrl.apiGetStarshipClasses);

router.post(
  "/personnel/photos",
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, year, description, _id } = req.body;
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 400, height: 400 })
        .png()
        .toBuffer();
      const file = new Photo({
        title,
        year,
        description,
        image: buffer,
        file_mimetype: "png",
        owner: _id,
      });
      await file.save();
      res.send("file uploaded successfully.");
    } catch (error) {
      res.status(400).send("Error while uploading file. Try again later.\n" + error.message);
      console.log(error.message);
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
