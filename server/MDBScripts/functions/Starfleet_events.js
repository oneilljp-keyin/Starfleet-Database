exports = async function (payload, response) {
  // payload contains {query, headers, body}
  const events = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("events");
  const id = payload.query.id;
  const eventSort = { date: parseInt(payload.query.sort) } || { date: 1 };

  let responseData = { message: "Something Went Wrong in the 'events' function" };

  switch (context.request.httpMethod) {
    case "GET": {
      if (!id) {
        let idQuery = {};
        let idType = {};

        if (payload.query.officer_id) {
          idQuery = { "officers.officerId": BSON.ObjectId(payload.query.officer_id) };
        } else {
          idQuery = { $and: [{ "starships.starshipId": BSON.ObjectId(payload.query.starship_id) }, { officers: { $exists: false } }] };
        }

        if (payload.query.category == "Assign-Pro-De") {
          idType = { $or: [{ type: "Assignment" }, { type: "Promotion" }, { type: "Demotion" }] };
          if (payload.query.starship_id) {
            idQuery = { "starships.starshipId": BSON.ObjectId(payload.query.starship_id) };
          }
        } else if (payload.query.category == "Chronology") {
          idType = { type: { $exists: true } };
        } else {
          idType = { type: payload.query.category };
        }

        let query = { $and: [idQuery, idType] };

        let pipeline = [];

        if (payload.query.starship_id) {
          pipeline = [
            { $match: query },
            {
              $lookup: {
                from: "officers",
                let: { id: "$officerId" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                  { $project: { _id: 0, surname: 1, first: 1, middle: 1 } },
                ],
                as: "info",
              },
            },
            { $sort: eventSort },
            {
              $replaceRoot: {
                newRoot: { $mergeObjects: [{ $arrayElemAt: ["$info", 0] }, "$$ROOT"] },
              },
            },
            { $project: { info: 0, __v: 0, starshipId: 0 } },
            {
              $lookup: {
                from: "photos",
                let: { id: "$officerId" },
                pipeline: [
                  { $match: { $and: [{ $expr: { $eq: ["$owner", "$$id"] } }, { primary: true }] } },
                  { $project: { _id: 0, url: 1 } },
                ],
                as: "officerPics",
              },
            },
            { $addFields: { officerPicUrl: "$officerPics.url" } },
            { $project: { officerPics: 0 } },
          ];
        } else {
          pipeline = [
            { $match: query },
            // { $unwind: "$starships" },
            {
              $lookup: {
                from: "starships",
                let: { id: "$starships.starshipId" },
                pipeline: [
                  { $match: { $expr: { $in: ["$_id", "$$id"] } } },
                  { $project: { _id: 1, name: 1, registry: 1, class: 1, ship_id: 1 } },
                ],
                as: "info",
              },
            },
            // Option #2
            { $addFields: {
              "starships": {
                $map: { 
                  input: "$starships",
                  as: "shipInfo",
                  in: {
                    $mergeObjects: [
                      "$$shipInfo",
                      { name: { $arrayElemAt: ["$info.name", { $indexOfArray: ["$info._id", "$$shipInfo.starshipId"] }] }},
                      { ship_id: { $arrayElemAt: ["$info.ship_id", { $indexOfArray: ["$info._id", "$$shipInfo.starshipId"] }] }},
                      { registry: { $arrayElemAt: ["$info.registry", { $indexOfArray: ["$info._id", "$$shipInfo.starshipId"] }] }},
                      { class: { $arrayElemAt: ["$info.class", { $indexOfArray: ["$info._id", "$$shipInfo.starshipId"] }] }}
                    ]
                  }
                }
              }
            }},
            // Option #1 - using unwind, error about starshipId must be accumalator object??
            // { $unwind: "$info" },
            // { $addFields: {
            //   "starships.ship_id": "info.ship_id",
            //   "starships.name": "info.name",
            //   "starships.registry": "info.registry",
            //   "starships.class": "info.class"
            // } },
            // { $group: {
            //   starshipId: "$starshipId",
            //   starships: { $push: "$starships"},
            //   ship_id: { $first: "$ship_id"},
            //   name: { $first: "$name"},
            //   registry: { $first: "$registry"},
            //   class: { $first: "$class"},
            // } },
            { $sort: eventSort },
            // {
            //   $replaceRoot: {
            //     newRoot: { $mergeObjects: [{ $arrayElemAt: ["$info", 0] }, "$$ROOT"] },
            //   },
            // },
            { $project: { info: 0, __v: 0, officerId: 0 } },
            {
              $lookup: {
                from: "photos",
                let: { id: "$$starships.starshipId" },
                pipeline: [
                  { $match: { $and: [{ $expr: { $in: ["$owner", "$$id"] } }, { primary: true }] } },
                  { $project: {url: 1 } },
                ],
                as: "starshipPics",
              },
            },
            // { $addFields: { starshipPicUrl: "$starshipPics.url" } },
            { $addFields: {
              "starships": {
                $map: { 
                  input: "$starships",
                  as: "shipPic",
                  in: {
                    $mergeObjects: [
                      "$$starshipInfo",
                      { starshipPicUrl: { $arrayElemAt: ["$shipPic.url", { $indexOfArray: ["$starshipPics._id", "$$starshipInfo.starshipId"] }] }}
                    ]
                  }
                }
              }
            }},
            { $project: { starshipPics: 0 } },
          ];
        }

        // return pipeline;

        let responseData = await events.aggregate(pipeline).toArray();

        responseData.forEach((event) => {
          event._id = event._id.toString();
          if (event.date) { event.date = new Date(event.date).toISOString(); }
          if (event.endDate) { event.endDate = new Date(event.endDate).toISOString(); }
          if (event.officerId) { event.officerId = event.officerId.toString(); }
          if (event.starshipId) { event.starshipId = event.starshipId.toString(); }
          if (event.ship_id) { event.ship_id = event.ship_id.toString(); }
          if (event.starships) {
            for (let i = 0; i < event.starships.length; i++) {
              event.starships[i].starshipId = event.starships[i].starshipId.toString();
              event.starships[i].ship_id = event.starships[i].ship_id.toString();
            }
          }
          if (event.officers) {
            for (let i = 0; i < event.officers.length; i++) {
              event.officers[i].officerId = event.officers[i].officerId.toString();
            }
          }
        });

        return responseData;
      } else {
        responseData = await events.findOne({ _id: BSON.ObjectId(id) });

        responseData._id = responseData._id.toString();
        if (responseData.officers) {
          for (let i = 0; i < responseData.officers.length; i++) {
            responseData.officers[i].officerId = responseData.officers[i].officerId.toString();
          }
        }
        if (responseData.starships) {
          for (let i = 0; i < responseData.starships.length; i++) {
            responseData.starships[i].starshipId = responseData.starships[i].starshipId.toString();
          }
        }
        if (responseData.officerId) { responseData.officerId = responseData.officerId.toString(); }
        if (responseData.starshipId) { responseData.starshipId = responseData.starshipId.toString(); }
        if (responseData.ship_id) { responseData.ship_id = responseData.ship_id.toString(); }
        if (responseData.date) { responseData.date = new Date(responseData.date).toISOString(); }
        if (responseData.endDate) { responseData.endDate = new Date(responseData.endDate).toISOString(); }
        delete responseData["__v"];
      }
      return responseData;
    }
    case "POST": {
      const eventInfo = EJSON.parse(payload.body.text());

      if (eventInfo.starshipId) eventInfo.starshipId = BSON.ObjectId(eventInfo.starshipId);
      if (eventInfo.officerId) eventInfo.officerId = BSON.ObjectId(eventInfo.officerId);
      if (eventInfo.date) eventInfo.date = new Date(eventInfo.date);
      if (eventInfo.endDate) eventInfo.endDate = new Date(eventInfo.endDate);
      try {
        await events.insertOne(eventInfo);
        return { message: "Record Inserted Successfully" };
      } catch (err) {
        console.error(`Record Insert Failed ${err.message}`);
        return { message: `Record Insert Failed ${err.message}` };
      }
      break;
    }
    case "DELETE": {
      try {
        await events.deleteOne({ _id: BSON.ObjectId(id) });
        return { message: "Event Record Successfully Deleted" };
      } catch (err) {
        return { message: `Deletion of Record Failed ${err.message}` };
      }
      break;
    }
    case "PUT": {
      const updatedInfo = EJSON.parse(payload.body.text());
      const eventId = updatedInfo._id;

      if (updatedInfo.date) updatedInfo.date = new Date(updatedInfo.date);
      if (updatedInfo.endDate) updatedInfo.endDate = new Date(updatedInfo.endDate);
      if (updatedInfo.starshipId) updatedInfo.starshipId = BSON.ObjectId(updatedInfo.starshipId);
      if (updatedInfo.officerId) updatedInfo.officerId = BSON.ObjectId(updatedInfo.officerId);

      delete updatedInfo["_id"];

      try {
        await events.updateOne({ _id: BSON.ObjectId(eventId) }, { $set: updatedInfo });
        return { message: "Record Updated Successfully" };
        // return updatedInfo;
      } catch (err) {
        console.error(`Record Update Failed ${err.message}`);
        return { message: `Record Update Failed ${err.message}` };
      }
    }
  }

  return responseData;
};
