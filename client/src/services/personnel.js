import axios from "axios";
import http from "../http-common";

class PersonnelDataService {
  getAll(page = 0) {
    return http.get(`/personnel?page=${page}`);
  }

  get(id) {
    return http.get(`/personnel?id=${id}`);
  }

  find(query, pageNumber = "0", cancel) {
    return http.get(`/personnel?name=${query}&page=${pageNumber}`, {
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });
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

export default new PersonnelDataService();
