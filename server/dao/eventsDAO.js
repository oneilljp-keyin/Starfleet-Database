const mongoose = require("mongoose");
const pool = require("../db/postGresSQL");

const ObjectId = mongoose.mongo.ObjectID;
let events;
module.exports = class EventsDAO {
  static async injectDB(conn) {
    if (events) {
      return;
    }
    try {
      events = await conn.db(process.env.MONDO_DB_NAME).collection("events");
    } catch (e) {
      console.error(`Unable to establish a collection handle in personnelDAO: ${e}`);
    }
  }

  static async getAllOfficerEvents({ page = 0, eventsPerPage = 20, db = "mongo", officerId } = {}) {
    let query;
    // MongoDB query
    // console.log("MongoDB Query");
    if (filters) {
      if ("officerId" in filters) {
        query = { officerId: ObjectId(officerId) };
      }
    }

    let cursor;

    try {
      cursor = await events.find(query).sort({ date: -1 });
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { eventsList: [], totalNumEvents: 0 };
    }

    const displayCursor = cursor.limit(eventsPerPage).skip(eventsPerPage * page);

    try {
      const eventsList = await displayCursor.toArray();
      const totalNumEvents = await events.countDocuments(query);

      return { eventsList, totalNumEvents };
    } catch (err) {
      console.error(`Unable to convert cursor to array or problem counting documents, ${err}`);
    }
    return { eventsList: [], totalNumEvents: 0 };
  }

  // static async getEventById(eventId, db = "mongo") {
  //   try {
  //     const pipeline = [
  //       { $match: { _id: new ObjectId(eventId) } },
  //       {
  //         $lookup: {
  //           from: "events",
  //           let: { id: "$_id" },
  //           pipeline: [
  //             { $match: { $expr: { $eq: ["$personnel_id", "$$id"] } } },
  //             { $sort: { date: -1 } },
  //           ],
  //           as: "events",
  //         },
  //       },
  //       {
  //         $addFields: {
  //           events: "$events",
  //         },
  //       },
  //     ];
  //     return await personnel.aggregate(pipeline).next();
  //   } catch (err) {
  //     console.error(`Something went wrong in getpersonnelByID: ${err}`);
  //   }
  // }
};
