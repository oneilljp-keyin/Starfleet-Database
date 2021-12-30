import http from "../http-common";

class PersonnelDataService {
  getAll(page = 0) {
    return http.get(`/personnel?page=${page}`);
  }

  get(id) {
    return http.get(`/personnelById?id=${id}`);
  }

  find(query, by = "name") {
    return http.get(`/personnel?${by}=${query}`);
  }

  getRankLabels() {
    return http.get("/ranks");
  }

  getAllEvent(officerId) {
    return http.get(`/personnel/events?officer_id=${officerId}`);
  }

  getEvent(eventId) {
    return http.get(`/personnel/event?event_id=${eventId}`);
  }

  insertEvent(eventInfo) {
    return http.post("/personnel/event/", eventInfo);
  }

  updateEvent(eventInfo) {
    return http.patch("/personnel/event/", eventInfo);
  }

  createOfficer(officerInfo) {
    return http.post("/personnel", officerInfo);
  }

  updateOfficer(officerInfo) {
    console.log(officerInfo);
    return http.patch("/personnelById", officerInfo);
  }

  insertPhoto(photoInfo) {
    return http.post("/photos", photoInfo, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  getAllPhotos(id) {
    return http.get(`/photos?id=${id}`);
  }
}

export default new PersonnelDataService();
