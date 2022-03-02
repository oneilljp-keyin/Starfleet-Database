exports = async function(payload, response) {
  const personnel = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("officers");
  const id = payload.query.id;
  let responseData = {message: "Something Went Wrong in the 'personnel' Function"};

  switch(context.request.httpMethod) {
    // Get a list of starships (search by name or class if search value provided) or by _id for individual
    case "GET": {
      if (!id) {
        const {personnelPerPage = 10, page = 0} = payload.query;
        let query = {};
    
        if (payload.query.name) {
          query = { $or: [
            { surname: { $regex: payload.query.name, $options: "i" }},
            { first: { $regex: payload.query.name, $options: "i" }}
            ]};
        }
        
        const pipeline = [
          { $match: query },
          {
            $lookup: {
              from: "photos",
              let: { id: "$_id" },
              pipeline: [
                { $match: { $and: [ { $expr: { $eq: ["$owner", "$$id"] } }, { primary: true } ] } },
                // { $match: { $expr: { $eq: ["$owner", "$$id"] } } },
                { $project: { "_id": 0, "title": 0, "description": 0, "owner": 0} },
                // { $sort: { year: -1 } },
                // { $limit: 1 },
              ],
              as: "officerPics",
            }
          },
          { $addFields: { officerPicUrl: "$officerPics.url" } },
          { $project: { "officerPics": 0 } },
          { $skip: page*personnelPerPage },
          { $limit: personnelPerPage },
        ];

        let personnelList = await personnel.aggregate(pipeline).toArray();
        
        personnelList.forEach(officer => {
          officer._id = officer._id.toString();
          if(officer.birthDate) {officer.birthDate = new Date(officer.birthDate).toISOString();}
          if(officer.deathDate) {officer.deathDate = new Date(officer.deathDate).toISOString();}
        })
        
        responseData = {
          personnel: personnelList,
          page: page.toString(),
          entries_per_page: personnelPerPage.toString(),
          total_results: await personnel.count(query).then(num => num.toString()),
        };
      } else {
        // const pipeline = [
        //   { $match: { _id: BSON.ObjectId(id), } },
        //   {
        //     $lookup: {
        //       from: "events",
        //       let: { id: "$_id" },
        //       pipeline: [
        //         { $match: { $expr: { $eq: ["$officerId", "$$id"] } } },
        //         {
        //           $lookup: {
        //             from: "starships",
        //             localField: "starshipId",
        //             foreignField: "_id",
        //             as: "starshipInfo",
        //           },
        //         },
        //         { $sort: { date: 1 } },
        //         { $project: { 
        //             "starshipInfo._id": 0, 
        //             "starshipInfo.class": 0, 
        //             "starshipInfo.shipyard": 0, 
        //             "starshipInfo.ship_id": 0, 
        //             "starshipInfo.launch_date": 0,
        //             "starshipInfo.launch_note": 0,
        //             "starshipInfo.commission_date": 0,
        //             "starshipInfo.commission_note": 0,
        //             "starshipInfo.decommission_date": 0,
        //             "starshipInfo.decommission_note": 0,
        //             "starshipInfo.destruction_date": 0,
        //             "starshipInfo.destruction_note": 0,
        //           }
        //         },
        //         { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$starshipInfo", 0 ] }, "$$ROOT" ] } } },
        //         { $project: { starshipInfo: 0, "__v": 0 } }
        //       ],
        //       as: "events",
        //     },
        //   },
        //   { $addFields: { events: "$events" } },
        //   {
        //     $lookup: {
        //       from: "events",
        //       let: { id: "$_id" },
        //       pipeline: [
        //         { $match: { $and: [ { $expr: { $eq: ["$officerId", "$$id"] } }, { type: "Assignment" } ] } },
        //         { $sort: { date: -1 } },
        //         { $limit: 1 },
        //         { $project: { "rankLabel": 1, "position": 1, "location": 1, "date": 1, "starshipId": 1, "_id": 0 } },
        //         {
        //           $lookup: {
        //             from: "starships",
        //             localField: "starshipId",
        //             foreignField: "_id",
        //             as: "starshipInfo",
        //           },
        //         },
        //         { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$starshipInfo", 0 ] }, "$$ROOT" ] } } },
        //         { $project: { starshipInfo: 0, "ship_id": 0,  "class": 0, "shipyard": 0, "starshipId": 0, 
        //                       "launch_date": 0, "launch_stardate": 0, "launch_note": 0,
        //                       "commission_date": 0, "commission_stardate": 0, "commission_note": 0,
        //                       "decommission_date": 0, "decommission_stardate": 0, "decommission_note": 0, 
        //                       "destruction_date": 0, "destruction_stardate": 0, "destruction_note": 0, } }
        //       ],
        //       as: "lastAssignment",
        //     },
        //   },
        //   // { $addFields: { lastAssignment: "$lastAssignment" } },
        //   {
        //     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$lastAssignment", 0 ] }, "$$ROOT" ] } }
        //   },
        //   { $project: { "lastAssignment": 0 } },
        // ];
        
        responseData = await personnel.findOne( { _id: BSON.ObjectId(id) } );
        
        responseData._id = responseData._id.toString();
        if (responseData.species_id) {responseData.species_id = responseData.species_id.toString();}
        if (responseData.birthDate) {responseData.birthDate = new Date(responseData.birthDate).toISOString();}
        if (responseData.deathDate) {responseData.deathDate = new Date(responseData.deathDate).toISOString();}
        if (responseData.date) {responseData.date = new Date(responseData.date).toISOString();}
        
        // responseData.events.forEach(event => {
        //   event._id = event._id.toString();
        //   if(event.date) {event.date = new Date(event.date).toISOString();}
        //   if(event.officerId) {event.officerId = event.officerId.toString();}
        //   if(event.starshipId) {event.starshipId = event.starshipId.toString();}
        // });
      }
      return responseData;
    }
    case "POST": {
      const newOfficer = EJSON.parse(payload.body.text());
      if(newOfficer.birthDate) {newOfficer.birthDate = new Date(newOfficer.birthDate);}
      if(newOfficer.deathDate) {newOfficer.deathDate = new Date(newOfficer.deathDate);}
      
      try {
        await personnel.insertOne(newOfficer);
        return { message: "Record Inserted Successfully" };
      } catch (err) {
        console.error(`Record Insert Failed ${err.message}`);
        return {message: `Record Insert Failed ${err.message}`};
      }
      break;
    }
    case "DELETE": {
      try {
        await personnel.deleteOne( { _id: BSON.ObjectId(id) } );
        return {message: "Personnel Record Successfully Deleted"}
      } catch (err) {
        return { message: `Deletion of Record Failed ${err.message}` };
      }
      break;
    }

    case "PUT":    { 
      const updatedInfo = EJSON.parse(payload.body.text());
      const officerId = updatedInfo._id;
      let officerName;
      if(updatedInfo.first) officerName = updatedInfo.first;
      if(updatedInfo.first && updatedInfo.surname) officerName += " ";
      if(updatedInfo.surname) officerName += updatedInfo.surname;
      if(updatedInfo.birthDate) {updatedInfo.birthDate = new Date(updatedInfo.birthDate);}
      if(updatedInfo.deathDate) {updatedInfo.deathDate = new Date(updatedInfo.deathDate);}
      delete updatedInfo["_id"];
      
      try {
        await personnel.updateOne({ _id: BSON.ObjectId(officerId) }, { $set: updatedInfo });
        return { message: "Record " + officerName + " Updated Successfully" };
        // return updatedInfo;
          } catch (err) {
        console.error(`Record Update Failed ${err.message}`);
        return { message: `Record Update Failed ${err.message}` };
      }
    }

  }
};