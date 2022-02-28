exports = async function(payload, response) {
  
  const subjectId = payload.query.subject_id || "";
  const photoId = payload.query.id;
  const photos = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("photos");
      
  switch(context.request.httpMethod) {
    case "GET": {
      if(!photoId) {
        let subjectPhotos = [];
        
        subjectPhotos = await photos.find({owner: BSON.ObjectId(subjectId)}).sort({ year: -1 }).toArray();
        
        subjectPhotos.forEach(photo => {
          photo._id = photo._id.toString();
          photo.owner = photo.owner.toString();
        });
    
        return subjectPhotos;
      } else {
        let photoInfo;
        photoInfo = await photos.findOne({_id: BSON.ObjectId(photoId)});
        
        // return photoInfo;
        
        photoInfo._id = photoInfo._id.toString();
        photoInfo.owner = photoInfo.owner.toString();
        
        return photoInfo;        
      }
      break;
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
    case "PUT": {
      const updatedInfo = EJSON.parse(payload.body.text());
      const photoId = updatedInfo._id;

      delete updatedInfo["_id"];
      delete updatedInfo["owner"];
      delete updatedInfo["url"];

      try {
        await photos.updateOne({ _id: BSON.ObjectId(photoId) }, { $set: updatedInfo });
        return { message: "Record Updated Successfully" };
      } catch (err) {
        console.error(`Record Update Failed ${err.message}`);
        return { message: `Record Update Failed ${err.message}` };
      }
      break;
    }
    case "DELETE": {
      try {
        await photos.deleteOne({ _id: BSON.ObjectId(id) });
        return { message: "Photo Info Successfully Deleted" };
      } catch (err) {
        return { message: `Deletion of Photo Info Failed ${err.message}` };
      }
      break;
    }
  }
};