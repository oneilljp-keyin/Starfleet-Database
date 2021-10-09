const EventsDAO = require("../dao/eventsDAO");
const LifeEvent = require("../models/Event");
const Officer = require("../models/Personnel");

module.exports = class EventsController {
  static async apiGetAllEvents(req, res, next) {
    const officerId = req.query.officerId;
    try {
      let events = await EventsDAO.getAllOfficerEvents({ officerId });
      res.json(events);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiAddLifeEvent(req, res, next) {
    const eventInfo = new LifeEvent(req.body);
    // console.log(req.body);
    try {
      await eventInfo.save();
      res.status(201).send({ message: "Entry Succesful" });
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ message: err.message });
    }
  }

  static async apiGetEventById(req, res, next) {}

  static async apiUpdateLifeEvent(req, res, next) {}
};
