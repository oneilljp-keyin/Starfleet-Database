exports = async function (payload, response) {
  // payload contains {query, headers, body}
  const events = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("events");

  let responseData = { message: "Something Went Wrong in the 'events' function" };

  const updatedInfo = EJSON.parse(payload.body.text());

  let stardate = updatedInfo.stardate ? updatedInfo.stardate : null;
  let date = updatedInfo.date ? new Date(updatedInfo.date): null;

  try {
    if (stardate) {
     await events.updateMany({ stardate: stardate }, { $set: { "date" : date} });
     await events.updateMany({ endStardate: stardate }, { $set: { "endDate" : date} });
    }
    if (stardate) {
      // return { message: "Records Updated Successfully" };
      return { stardateUpdate, endStardateUpdate };
    } else {
      return { message: "No records to Update" };
    }
  } catch (err) {
    console.error(`Record Update Failed ${err.message}`);
    return { message: `Record Update Failed ${err.message}` };
  }

  return responseData;
  // return {stardate, date, endStardate, endDate};
};
