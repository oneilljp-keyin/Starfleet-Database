import axios from "axios";
import http from "../http-common";

class SystemsDataService {
  getAll(page = 0) {
    return http.get(`/systems?page=${page}`);
  }

  get(id) {
    return http.get(`/systems?id=${id}`);
  }

  find(name, pageNumber = "0", cancel) {
    return http.get(`/systems?name=${name}&page=${pageNumber}`, {
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });
  }

  findForEvents(query) {
    return http.get(`/systems?name=${query}`);
  }

  createSystem(systemInfo) {
    return http.post("/systems", systemInfo);
  }

  updateSystem(systemInfo) {
    return http.put("/systems", systemInfo);
  }

  deleteSystem(systemId) {
    return http.delete(`/systems?id=${systemId}`);
  }
}

export default new SystemsDataService();
