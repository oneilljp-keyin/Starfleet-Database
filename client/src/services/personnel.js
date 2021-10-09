import http from "../http-common";

class PersonnelDataService {
  getAll(page = 0, db = "mongo") {
    return http.get(`/personnel?page=${page}&db=${db}`);
  }

  get(id, db = "mongo") {
    return http.get(`/personnel/id?id=${id}&db=${db}`);
  }

  find(query, by = "name", db = "mongo", userId) {
    return http.get(`/personnel?${by}=${query}&db=${db}&userId=${userId}`);
  }

  getRankLabels() {
    return http.get("/personnel/ranks/");
  }

  getAllEvent(officerId, db = "mongo") {
    return http.get(`/personnel/events?officer_id=${officerId}&db=${db}`);
  }

  getEvent(eventId, db = "mongo") {
    return http.get(`/personnel/event?event_id=${eventId}&db=${db}`);
  }

  insertEvent(eventInfo) {
    return http.post("/personnel/event/", eventInfo);
  }

  updateEvent(eventInfo) {
    return http.patch("/personnel/event/", eventInfo);
  }

  insertPhoto(photoInfo) {
    return http.post("/personnel/photos/", photoInfo, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  getAllPhotos(id) {
    return http.get(`/personnel/photos?id=${id}`);
  }
}

export default new PersonnelDataService();
