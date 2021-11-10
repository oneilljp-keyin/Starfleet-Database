import http from "../http-common";

class StarshipsDataService {
  getAll(page = 0, db = "mongo") {
    return http.get(`starships?page=${page}&db=${db}`);
  }

  get(id, db = "mongo") {
    return http.get(`/starships/id?id=${id}&db=${db}`);
  }

  find(query, by = "name", db = "mongo", userId = "null", page = "0", perpage = "30") {
    return http.get(
      `/starships?${by}=${query}&db=${db}&userId=${userId}&page=${page}&starshipsPerPage=${perpage}`
    );
  }

  createStarship(data) {
    return http.post("/starships", data);
  }

  updateStarship(starshipInfo) {
    return http.patch("/starships/id/", starshipInfo);
  }

  getStarshipClasses() {
    return http.get("/starships/classes");
  }
}

export default new StarshipsDataService();
