import axios from "axios";
import http from "../http-common";

class EventsAndPhotosDataService {
  insertEvent(eventInfo) {
    return http.post("/events", eventInfo);
  }

  updateEvent(eventInfo) {
    return http.patch("/events", eventInfo);
  }

  async insertPhoto(formData, photoInfo) {
    let uploadResult = await axios.post(
      "http://sector709.johnny-o.net/images/upload.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    photoInfo.url = uploadResult.data.url;

    return http.post("/photos", photoInfo);
  }

  getAllPhotos(id) {
    return http.get(`/photos?id=${id}`);
  }
}

export default new EventsAndPhotosDataService();
