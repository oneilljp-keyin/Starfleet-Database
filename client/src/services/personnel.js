import http from "../http-common";

class PersonnelDataService {
  getAll(page = 0) {
    return http.get(`/personnel?page=${page}`);
  }

  get(id) {
    return http.get(`/personnel?id=${id}`);
  }

  find(query, by = "name") {
    return http.get(`/personnel?${by}=${query}`);
  }

  createOfficer(officerInfo) {
    return http.post("/personnel", officerInfo);
  }

  updateOfficer(officerInfo) {
    return http.put("/personnel", officerInfo);
  }

  getRankLabels() {
    return http.get("/ranks");
  }

  insertEvent(eventInfo) {
    return http.post("/personnel/event/", eventInfo);
  }

  updateEvent(eventInfo) {
    return http.patch("/personnel/event/", eventInfo);
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
