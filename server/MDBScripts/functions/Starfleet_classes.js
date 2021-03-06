// This function is the webhook's request handler.
exports = async function(payload, response) {
    let classes = [];
    
    const collection = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("starships");

    try {
      classes = await collection.distinct("class");
      return classes;
    } catch (e) {
      console.error(`Unable to get classes, ${e}`);
      return classes;
    }
};