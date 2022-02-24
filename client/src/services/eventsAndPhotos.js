import axios from "axios";
import http from "../http-common";

class EventsAndPhotosDataService {
  insertEvent(eventInfo) {
    return http.post("/events", eventInfo);
  }

  getEvent(id) {
    return http.get(`/events?id=${id}`);
  }

  getEventsByCategory(officerId = "", starshipId = "", category = "") {
    let urlQuery = "";
    if (category && category !== "" && category !== undefined && category !== null) {
      urlQuery += "category=" + category;
    }
    if (officerId && officerId !== "" && officerId !== undefined && officerId !== null) {
      if (urlQuery.length > 0) urlQuery += "&";
      urlQuery += "officer_id=" + officerId;
    }
    if (starshipId && starshipId !== "" && starshipId !== undefined && starshipId !== null) {
      if (urlQuery.length > 0) urlQuery += "&";
      urlQuery += "starship_id=" + starshipId;
    }
    return http.get(`/events?${urlQuery}`);
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
