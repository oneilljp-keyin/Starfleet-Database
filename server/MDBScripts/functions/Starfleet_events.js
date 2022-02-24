exports = async function(payload, response) {
  // payload contains {query, headers, body}
  const events = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("events");
  const id = payload.query.id;

  let responseData = {message: "Something Went Wrong in the 'events' function"};

  switch(context.request.httpMethod) {
    case "GET": {
      if (!id) {
        let idQuery = {}; let idLookup = {}; let idProject = {};

        if (payload.query.officer_id) { 
          idQuery = { officerId: BSON.ObjectId(payload.query.officer_id) }
        } else {
          idQuery = { starshipId: BSON.ObjectId(payload.query.starship_id) } 
        }
        let query = { $and: [ idQuery, { type: payload.query.category } ] };
        
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
                  { $project: {"_id": 0, "surname": 1, "first": 1, "middle": 1 } },
                ],
              as: "info",
              }
            },
            { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$info", 0 ] }, "$$ROOT" ] } } },
            { $project: {info: 0, __v: 0, starshipId: 0 } },
            {
              $lookup: {
                from: "photos",
                let: { id: "$officerId" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$owner", "$$id"] } } },
                  { $project: { "_id": 0, "url": 1 } },
                  { $sort: { year: -1 } },
                  { $limit: 1 },
                ],
              as: "officerPics",
            }
          },
          { $addFields: { officerPicUrl: "$officerPics.url" } },
          { $project: { officerPics: 0 } },
          ];
        } else {
          pipeline = [
            { $match: query },
            { $lookup: { from: "starships", localField: "starshipId", foreignField: "_id", as: "info", } },
            { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$info", 0 ] }, "$$ROOT" ] } } },
            { $project: { info: 0, "__v": 0, "ship_id": 0,  "class": 0, "shipyard": 0, "officerId": 0,
                              "launch_date": 0, "launch_stardate": 0, "launch_note": 0,
                              "commission_date": 0, "commission_stardate": 0, "commission_note": 0,
                              "decommission_date": 0, "decommission_stardate": 0, "decommission_note": 0, 
                              "destruction_date": 0, "destruction_stardate": 0, "destruction_note": 0, } }
          ];
        }

        let responseData = await events.aggregate(pipeline).toArray();
        
        responseData.forEach(event => {
          event._id = event._id.toString();
          if(event.date) {event.date = new Date(event.date).toISOString();}
          if(event.starshipId) {event.starshipId = event.starshipId.toString();}
          if(event.officerId) {event.officerId = event.officerId.toString();}
        })
        
        // responseData = {
        //   personnel: personnelList,
        //   page: page.toString(),
        //   entries_per_page: personnelPerPage.toString(),
        //   total_results: await personnel.count(query).then(num => num.toString()),
        // };
        
        return responseData;
      } else {
        responseData = await events.findOne({ _id: BSON.ObjectId(id) });

      //   const pipeline = [
      //     { $match: { _id: BSON.ObjectId(id), } },
      //     {
      //       $lookup: {
      //         from: "events",
      //         let: { id: "$_id" },
      //         pipeline: [
      //           { $match: { $expr: { $eq: ["$officerId", "$$id"] } } },
      //           { $sort: { date: 1 } },
      //         ],
      //         as: "events",
      //       },
      //     },
      //     { $addFields: { events: "$events" } },
      //     {
      //       $lookup: {
      //         from: "events",
      //         let: { id: "$_id" },
      //         pipeline: [
      //           { $match: { $expr: { $eq: ["$officerId", "$$id"] } } },
      //           { $project: { "rankLabel": 1, "position": 1, "location": 1, "starshipName": 1, "starshipRegistry": 1, "date": 1, "_id": 0 } },
      //           { $sort: { date: -1 } },
      //           { $limit: 1 },
      //         ],
      //         as: "promotions",
      //       },
      //     },
      //     {
      //       $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$promotions", 0 ] }, "$$ROOT" ] } }
      //     },
      //     // { $addFields: { promotions: "$promotions"} },
      //     // { $addFields: { lastRank: "$promotions.rankLabel", } },
      //     { $project: { "promotions": 0 } },
      //   ];
        
      //   responseData = await personnel.aggregate(pipeline).next();
        
        responseData._id = responseData._id.toString();
        if (responseData.officerId) {responseData.officerId = responseData.officerId.toString();}
        if (responseData.starshipId) {responseData.starshipId = responseData.starshipId.toString();}
        if (responseData.date) {responseData.date = new Date(responseData.date).toISOString();}
        delete responseData["__v"];

        
      //   responseData.events.forEach(event => {
      //     event.date = new Date(event.date).toISOString();
      //     event._id = event._id.toString();
      //     if(event.officerId) {event.officerId = event.officerId.toString();}
      //     if(event.starshipId) {event.starshipId = event.starshipId.toString();}
      //   });
      }
      return responseData;
    }
    case "POST": {
      const eventInfo = EJSON.parse(payload.body.text());

      if(eventInfo.starshipId) eventInfo.starshipId = BSON.ObjectId(eventInfo.starshipId);
      if(eventInfo.officerId) eventInfo.officerId = BSON.ObjectId(eventInfo.officerId);
      if(eventInfo.date) eventInfo.date = new Date(eventInfo.date);
      try {
        await events.insertOne(eventInfo);
        return { message: "Record Inserted Successfully" };
      } catch (err) {
        console.error(`Record Insert Failed ${err.message}`);
        return {message: `Record Insert Failed ${err.message}`};
      }
      break;
    }
    case "DELETE": {
      try {
        await events.deleteOne( { _id: BSON.ObjectId(id) } );
        return {message: "Event Record Successfully Deleted"}
      } catch (err) {
        return { message: `Deletion of Record Failed ${err.message}` };
      }
      break;
    }
    case "PUT": { 
      const updatedInfo = EJSON.parse(payload.body.text());
      const eventId = updatedInfo._id;

      if(updatedInfo.date) {updatedInfo.date = new Date(updatedInfo.date);}
      if(updatedInfo.starshipId) updatedInfo.starshipId = BSON.ObjectId(updatedInfo.starshipId);
      if(updatedInfo.officerId) updatedInfo.officerId = BSON.ObjectId(updatedInfo.officerId);

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
