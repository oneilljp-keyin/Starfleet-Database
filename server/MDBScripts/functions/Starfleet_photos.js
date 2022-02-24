exports = async function(payload, response) {
  
  const photos = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("photos");
      
  switch(context.request.httpMethod) {
    case "GET": {

      const id = payload.query.id || "";
      
      let officerPhotos = [];
      
      officerPhotos = await photos.find({owner: BSON.ObjectId(id)}).sort({ year: -1 }).toArray();
      
      officerPhotos.forEach(officerPhoto => {
        officerPhoto._id = officerPhoto._id.toString();
        officerPhoto.owner = officerPhoto.owner.toString();
        if(officerPhoto.createdAt) {officerPhoto.createdAt = new Date(officerPhoto.createdAt).toString();}
        if(officerPhoto.updatedAt) {officerPhoto.updatedAt = new Date(officerPhoto.updatedAt).toString();}
      });
  
      return officerPhotos;
    }
    case "POST": {
      const newPhotoInfo = EJSON.parse(payload.body.text());
      // return newPhotoInfo;
      newPhotoInfo.owner = BSON.ObjectId(newPhotoInfo.owner.toString());
      try {
        await photos.insertOne(newPhotoInfo);
        return { message: "Photo Inserted Successfully" };
      } catch (err) {
        console.error(`Photo Insert Failed ${err.message}`);
        return {message: `Photo Insert Failed ${err.message}`};
      }
      break;
    }
  }
};