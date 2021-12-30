import http from "../http-common";

class StarshipsDataService {
  getAll(page = 0) {
    return http.get(`/starships?page=${page}`);
  }

  get(id) {
    return http.get(`/starshipById?id=${id}`);
  }

  find(query, by = "name", page = "0", perpage = "30") {
    return http.get(`/starships?${by}=${query}`);
  }

  createStarship(data) {
    return http.post("/starships", data);
  }

  updateStarship(starshipInfo) {
    return http.patch("/starships/id/", starshipInfo);
  }

  getStarshipClasses() {
    return http.get("/classes");
  }
}

export default new StarshipsDataService();
