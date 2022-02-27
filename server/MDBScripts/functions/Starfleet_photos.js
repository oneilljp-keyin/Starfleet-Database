exports = async function(payload, response) {
  
  const subjectId = payload.query.subject_id || "";
  const photoId = payload.query.id;
  const photos = context.services.get("mongodb-atlas").db("StarfleetDatabase").collection("photos");
      
  switch(context.request.httpMethod) {
    case "GET": {
      if(!photoId) {
        let photos = [];
        
        photos = await photos.find({owner: BSON.ObjectId(subjectId)}).sort({ year: -1 }).toArray();
        
        photos.forEach(photo => {
          photo._id = photo._id.toString();
          photo.owner = photo.owner.toString();
        });
    
        return photos;
      } else {
        let photoInfo;
        photoInfo = await photos.find({_id: BSON.ObjectId(photoId)}).toArray();
        
        return photoInfo;
        
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
  }
};