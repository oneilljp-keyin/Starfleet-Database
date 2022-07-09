exports = async function (payload, response) {
  // payload contains {query, headers, body}
  const events = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("events");
  const stardate = payload.query.stardate;
  const new_date = payload.query.new_date;

  let responseData = { message: "Something Went Wrong in the 'events' function" };

  switch (context.request.httpMethod) {
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
      } catch (err) {
        console.error(`Record Update Failed ${err.message}`);
        return { message: `Record Update Failed ${err.message}` };
      }
    }
  }

  return responseData;
};
