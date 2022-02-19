import axios from "axios";
import http from "../http-common";

class EventsAndPhotosDataService {
  insertEvent(eventInfo) {
    return http.post("/events", eventInfo);
  }

  getEvent(id) {
    return http.get(`/events?id=${id}`);
  }

  updateEvent(eventInfo) {
    return http.put("/events", eventInfo);
  }

  deleteEvent(eventId) {
    return http.delete(`/events?id=${eventId}`);
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
