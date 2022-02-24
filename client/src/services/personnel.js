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

  deleteOfficer(officerId) {
    return http.delete(`/personnel?id=${officerId}`);
  }

  getRankLabels() {
    return axios.get("../ranks.json");
  }
}

export default new PersonnelDataService();
