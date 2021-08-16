const mongoose = require("mongoose");

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
      console.error(`Unable to establish connection handles in starshipsDAO: ${e}`);
    }
  }

  static async getStarships({ filters = null, page = 0, starshipsPerPage = 20 } = {}) {
    let query;
    if (filters) {
      if ("surname" in filters) {
        query = { $text: { $search: filters["surname"] } };
      }
    }

    let cursor;

    try {
      cursor = await starships.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { starshipsList: [], totalNumStarships: 0 };
    }

    const displayCursor = cursor.limit(starshipsPerPage).skip(starshipsPerPage * page);

    try {
      const starshipsList = await displayCursor.toArray();
      const totalNumStarships = await starships.countDocuments(query);

      return { starshipsList, totalNumStarships };
    } catch (e) {
      console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
    }
    return { starshipsList: [], totalNumStarships: 0 };
  }

  // static async addReview(restaurantId, user, review, date) {
  //   try {
  //     const reviewDoc = {
  //       name: user.name,
  //       user_id: user._id,
  //       date: date,
  //       text: review,
  //       restaurant_id: restaurantId,
  //     };
  //     return await starships.insertOne(reviewDoc);
  //   } catch (e) {
  //     console.error(`StarshipsDAO.js 31: Unable to post review: ${e}`);
  //     return { error: e };
  //   }
  // }

  // static async updateReview(reviewId, userId, text, date) {
  //   try {
  //     const updateResponse = await starships.updateOne(
  //       { user_id: userId, _id: ObjectId(reviewId) },
  //       { $set: { text: text, date: date } }
  //     );
  //     return updateResponse;
  //   } catch (e) {
  //     console.error(`Unable to update review: ${e}`);
  //     return { error: e };
  //   }
  // }

  // static async deleteReview(reviewId, userId) {
  //   try {
  //     const deleteResponse = await reviews.deleteOne({
  //       _id: ObjectId(reviewId),
  //       user_id: userId,
  //     });
  //     return deleteResponse;
  //   } catch (e) {
  //     console.error(`Unable to delete review: ${e}`);
  //     return { error: e };
  //   }
  // }

  static async getClasses() {
    let classes = [];
    try {
      classes = await starships.distinct("class");
      return classes;
    } catch (e) {
      console.error(`Unable to get starship classes, ${e}`);
      return classes;
    }
  }
};
