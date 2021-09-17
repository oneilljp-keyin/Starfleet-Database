const mongoose = require("mongoose");
const pool = require("../db/postGresSQL");

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

  static async getPersonnel({ filters = null, page = 0, personnelPerPage = 20, db, userId } = {}) {
    let query;
    // if (userId !== "null" && userId !== "undefined") {
    //   const history = new SearchHistory({
    //     searchString: filters["name"],
    //     category: "Personnel",
    //     userId: userId,
    //   });
    //   try {
    //     history.save();
    //   } catch (error) {
    //     return error.message;
    //   }
    // }
    if (db === "post") {
      try {
        // PostGreSQL query
        // console.log("PostGreSQL Query");
        query = "SELECT * FROM personnel";
        if (filters["name"]) {
          query += " WHERE LOWER(surname) LIKE '%" + filters["name"] + "%'";
        }
        query += " OFFSET " + page * personnelPerPage;

        const response = await pool.query(query);

        return { personnelList: response.rows, totalNumPersonnel: response.rowCount };
      } catch (err) {
        console.error(`Unable to issue find command, ${err}`);
        return { personnelList: [], totalNumPersonnel: 0 };
      }
    } else {
      // MongoDB query
      // console.log("MongoDB Query");
      if (filters) {
        if ("name" in filters) {
          query = { $text: { $search: filters["name"] } };
        }
      }

      let cursor;

      try {
        cursor = await personnel.find(query).sort({ surname: 1 });
      } catch (e) {
        console.error(`Unable to issue find command, ${e}`);
        return { personnelList: [], totalNumPersonnel: 0 };
      }

      const displayCursor = cursor.limit(personnelPerPage).skip(personnelPerPage * page);

      try {
        const personnelList = await displayCursor.toArray();
        const totalNumPersonnel = await personnel.countDocuments(query);

        return { personnelList, totalNumPersonnel };
      } catch (err) {
        console.error(`Unable to convert cursor to array or problem counting documents, ${err}`);
      }
      return { personnelList: [], totalNumPersonnel: 0 };
    }
  }

  static async getPersonnelById(id, db = "mongo") {
    // console.log(id, db);
    if (db === "post") {
      try {
        let query = `SELECT * FROM personnel WHERE personnel_id = ${id}`;

        const response = await pool.query(query);

        return response.rows[0];
      } catch (err) {
        console.error(`Something went wrong in getpersonnelByID: ${err}`);
      }
    } else {
      try {
        const pipeline = [
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: "events",
              let: { id: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$officerId", "$$id"] } } },
                { $sort: { date: 1 } },
              ],
              as: "events",
            },
          },
          {
            $addFields: {
              events: "$events",
            },
          },
        ];
        return await personnel.aggregate(pipeline).next();
      } catch (err) {
        console.error(`Something went wrong in getpersonnelByID: ${err}`);
      }
    }
  }
};
