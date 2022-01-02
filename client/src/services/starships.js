import axios from "axios";
import http from "../http-common";

class StarshipsDataService {
  getAll(page = 0) {
    return http.get(`/starships?page=${page}`);
  }

  get(id) {
    return http.get(`/starships?id=${id}`);
  }

  find(nameQuery, classQuery = "Unknown Class", pageNumber = "0", cancel) {
    return http.get(`/starships?name=${nameQuery}&class=${classQuery}&page=${pageNumber}`, {
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });
  }

  createStarship(data) {
    return http.post("/starships", data);
  }

  updateStarship(starshipInfo) {
    return http.put("/starships", starshipInfo);
  }

  getStarshipClasses() {
    return http.get("/classes");
  }
}

export default new StarshipsDataService();
