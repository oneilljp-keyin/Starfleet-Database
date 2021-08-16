const mongoose = require("mongoose");

const ObjectId = mongoose.mongo.ObjectID;
let personnel;
module.exports = class PersonnelDAO {
  static async injectDB(conn) {
    if (personnel) {
      return;
    }
    try {
      personnel = await conn.db(process.env.MONDO_DB_NAME).collection("personnel");
    } catch (e) {
      console.error(`Unable to establish a collection handle in personnelDAO: ${e}`);
    }
  }

  static async getPersonnel({ filters = null, page = 0, personnelPerPage = 20 } = {}) {
    let query;
    if (filters) {
      if ("surname" in filters) {
        query = { $text: { $search: filters["surname"] } };
      }
    }

    let cursor;

    try {
      cursor = await personnel.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { personnelList: [], totalNumPersonnel: 0 };
    }

    const displayCursor = cursor.limit(personnelPerPage).skip(personnelPerPage * page);

    try {
      const personnelList = await displayCursor.toArray();
      const totalNumPersonnel = await personnel.countDocuments(query);

      return { personnelList, totalNumPersonnel };
    } catch (e) {
      console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
    }
    return { personnelList: [], totalNumPersonnel: 0 };
  }

  static async getPersonnelById(id) {
    try {
      const pipeline = [
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "events",
            let: { id: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$personnel_id", "$$id"] } } },
              { $sort: { date: -1 } },
            ],
            as: "events",
          },
        },
        {
          $lookup: {
            from: "promotions",
            let: { id: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$personnel_id", "$$id"] } } },
              { $sort: { date: -1 } },
            ],
            as: "promotions",
          },
        },
        {
          $lookup: {
            from: "assignments",
            let: { id: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$personnel_id", "$$id"] } } },
              { $sort: { date: -1 } },
            ],
            as: "assignments",
          },
        },
        {
          $addFields: {
            events: "$events",
            promotions: "$promotions",
            assignments: "$assignments",
          },
        },
      ];
      return await personnel.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getpersonnelByID: ${e}`);
      throw e;
    }
  }
};
