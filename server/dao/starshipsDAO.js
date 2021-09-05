const mongoose = require("mongoose");
const pool = require("../db/postGresSQL");

const ObjectId = mongoose.mongo.ObjectID;
let starships;

module.exports = class StarshipsDAO {
  static async injectDB(conn) {
    if (starships) {
      return;
    }
    try {
      starships = await conn.db(process.env.MONDO_DB_NAME).collection("starships");
    } catch (e) {
      console.error(`Unable to establish a collection handle in starshipsDAO: ${e}`);
    }
  }

  static async getStarships({ filters = null, page = 0, starshipsPerPage = 20, db, userId } = {}) {
    let query;
    if (userId !== "null" && userId !== "undefined") {
      let searchString = filters["name"] ? filters["name"] : filters["class"];
      const history = new SearchHistory({
        searchString: searchString,
        category: "Starships",
        userId: userId,
      });
      try {
        history.save();
      } catch (error) {
        return error.message;
      }
    }
    if (db === "post") {
      try {
        // PostGreSQL query
        // console.log("PostGreSQL Query");
        query = "SELECT * FROM starships";
        if (filters["name"]) {
          query += " WHERE LOWER(name) LIKE '%" + filters["name"] + "%'";
        }
        query += " OFFSET " + page * starshipsPerPage;

        const response = await pool.query(query);

        return { starshipsList: response.rows, totalNumStarships: response.rowCount };
      } catch (err) {
        console.error(`Unable to issue find command, ${err}`);
        return { starshipsList: [], totalNumStarships: 0 };
      }
    } else {
      // MongoDB query
      console.log(filters);
      if (filters) {
        if ("name" in filters) {
          query = { $text: { $search: filters["name"] } };
        } else if ("class" in filters) {
          query = { class: { $eq: filters["class"] } };
        }
      }

      console.log(query);
      let cursor;

      try {
        cursor = await starships.find(query).sort({ ship_id: 1 });
      } catch (e) {
        console.error(`Unable to issue find command, ${e}`);
        return { starshipsList: [], totalNumStarships: 0 };
      }

      const displayCursor = cursor.limit(starshipsPerPage).skip(starshipsPerPage * page);

      try {
        const starshipsList = await displayCursor.toArray();
        const totalNumStarships = await starships.countDocuments(query);

        return { starshipsList, totalNumStarships };
      } catch (err) {
        console.error(`Unable to convert cursor to array or problem counting documents, ${err}`);
      }
      return { starshipsList: [], totalNumStarships: 0 };
    }
  }

  static async getStarshipById(id, db = "mongo") {
    // console.log(id, db);
    if (db === "post") {
      try {
        let query = `SELECT * FROM starships WHERE starships_id = ${id}`;

        const response = await pool.query(query);

        return response.rows[0];
      } catch (err) {
        console.error(`Something went wrong in getstarshipsByID: ${err}`);
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
                { $match: { $expr: { $eq: ["$starship_id", "$$id"] } } },
                { $sort: { date: -1 } },
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
        return await starships.aggregate(pipeline).next();
      } catch (err) {
        console.error(`Something went wrong in getstarshipsByID: ${err}`);
      }
    }
  }

  static async getClasses() {
    let classes = [];
    try {
      classes = await starships.distinct("class");
      return classes;
    } catch (e) {
      console.error(`Unable to get classes, ${e}`);
      return classes;
    }
  }
};
