exports = async function(payload, response) {
  const starships = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("starships");
  const id = payload.query.id;
  let responseData = {message: "Something Went Wrong in the 'starship' Function"};

  switch(context.request.httpMethod) {
    // Get a list of starships (search by name or class if search value provided) or by _id for individual
    case "GET": {
      if (!id) {
        let {starshipsPerPage = 10, page = 0} = payload.query;
        starshipsPerPage = parseInt(starshipsPerPage);
        let nameQuery = {}; let classQuery = {};
    
        if (payload.query.name) {
          nameQuery = { name: { $regex: "^" + payload.query.name + ".*", $options: "i" } };
        }
        
        if (!payload.query.class || payload.query.class === "Unknown" ) {
          classQuery = { $or: [
            { class: { $exists: true } },
            { class: { $exists: false } },
          ] };
        } else {
          classQuery = { class: { $eq: payload.query.class } };
        }
        
        let query = { $and: [ nameQuery, classQuery ] };
        
        const pipeline = [
          { $match: query },
          {
            $lookup: {
              from: "photos",
              let: { id: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$owner", "$$id"] } } },
                { $project: { "_id": 0, "title": 0, "description": 0, "owner": 0} },
                { $sort: { year: -1 } },
                { $limit: 1 },
              ],
              as: "starshipPics",
            }
          },
          { $addFields: { starshipPicUrl: "$starshipPics.url" } },
          { $project: { "starshipPics": 0 } },
          { $sort: { ship_id: 1 } },
          { $skip: page*starshipsPerPage },
          { $limit: starshipsPerPage },
        ];

        let starshipsList = await starships.aggregate(pipeline).toArray();
        
        starshipsList.forEach(starship => {
          starship._id = starship._id.toString();
          starship.ship_id = starship.ship_id.toString();
          if(starship.launch_date) {starship.launch_date = new Date(starship.launch_date).toISOString();}
          if(starship.commission_date) {starship.commission_date = new Date(starship.commission_date).toISOString();}
          if(starship.decommission_date) {starship.decommission_date = new Date(starship.decommission_date).toISOString();}
          if(starship.destruction_date) {starship.destruction_date = new Date(starship.destruction_date).toISOString();}
        });
        
        responseData = {
          starships: starshipsList,
          page: page.toString(),
          entries_per_page: starshipsPerPage.toString(),
          total_results: await starships.count(query).then(num => num.toString()),
        };
      } else {
        const pipeline = [
          { $match: { _id: BSON.ObjectId(id), } },
          {
            $lookup: {
              from: "events",
              let: { id: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$starshipId", "$$id"] } } },
                {
                  $lookup: {
                    from: "officers",
                    let: { id: "$officerId" },
                    pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                      { $project: { _id: 0, surname: 1, first: 1, middle: 1 } },
                    ],
                    as: "officerInfo",
                  },
                },
                { $sort: { date: 1 } },
                { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$officerInfo", 0 ] }, "$$ROOT" ] } } },
                { $project: { officerInfo: 0, "__v": 0 } }
              ],
              as: "events",
            },
          },
          { $addFields: { events: "$events" } },
        ];
        
        responseData = await starships.aggregate(pipeline).next();
        
        responseData._id = responseData._id.toString();
        responseData.ship_id = responseData.ship_id.toString();
        if(responseData.launch_date) {responseData.launch_date = new Date(responseData.launch_date).toISOString();}
        if(responseData.commission_date) {responseData.commission_date = new Date(responseData.commission_date).toISOString();}
        if(responseData.decommission_date) {responseData.decommission_date = new Date(responseData.decommission_date).toISOString();}
        if(responseData.destruction_date) {responseData.destruction_date = new Date(responseData.destruction_date).toISOString();}
        
        responseData.events.forEach(event => {
          if(event.date) {event.date = new Date(event.date).toISOString();}
          event._id = event._id.toString();
          if(event.officerId) {event.officerId = event.officerId.toString();}
          if(event.starshipId) {event.starshipId = event.starshipId.toString();}
        });
      }
      return responseData;
    }
    case "POST": {
      const newStarship = EJSON.parse(payload.body.text());
      if(newStarship.ship_id) {newStarship.ship_id = parseInt(newStarship.ship_id);}
      if(newStarship.launch_date) {newStarship.launch_date = new Date(newStarship.launch_date);}
      if(newStarship.commission_date) {newStarship.commission_date = new Date(newStarship.commission_date);}
      if(newStarship.decommission_date) {newStarship.decommission_date = new Date(newStarship.decommission_date);}
      if(newStarship.destruction_date) {newStarship.destruction_date = new Date(newStarship.destruction_date);}
      
      try {
        await starships.insertOne(newStarship);
        return { message: "Record Inserted Successfully" };
      } catch (err) {
        console.error(`Record Insert Failed ${err.message}`);
        return {message: `Record Insert Failed ${err.message}`};
      }
      break;
    }
    case "PUT":    { 
      const updatedStarship = EJSON.parse(payload.body.text());
      const starshipId = updatedStarship._id;
      let starshipName = updatedStarship.name;
      if (updatedStarship.registry) starshipName += " " + updatedStarship.registry;

      if(updatedStarship.ship_id) {updatedStarship.ship_id = parseInt(updatedStarship.ship_id);}
      if(updatedStarship.launch_date) {updatedStarship.launch_date = new Date(updatedStarship.launch_date);}
      if(updatedStarship.commission_date) {updatedStarship.commission_date = new Date(updatedStarship.commission_date);}
      if(updatedStarship.decommission_date) {updatedStarship.decommission_date = new Date(updatedStarship.decommission_date);}
      if(updatedStarship.destruction_date) {updatedStarship.destruction_date = new Date(updatedStarship.destruction_date);}
      
      delete updatedStarship["_id"];
      
      return updatedStarship;
      
      try {
        await starships.updateOne({ _id: BSON.ObjectId(starshipId) }, { $set: updatedStarship });
        return { message: "Record " + starshipName + " Updated Successfully" };
        // return updatedInfo;
          } catch (err) {
        console.error(`Record Update Failed ${err.message}`);
        return { message: `Record Update Failed ${err.message}` };
      }
      break;
    }
    case "DELETE": {
      try {
        await events.deleteOne( { _id: BSON.ObjectId(id) } );
        return {message: "Starship Record Successfully Deleted"}
      } catch (err) {
        return { message: `Deletion of Record Failed ${err.message}` };
      }
      break;
    }

  }
};