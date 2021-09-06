import http from "../http-common";

class StarshipsDataService {
  getAll(page = 0, db = "mongo") {
    return http.get(`starships?page=${page}&db=${db}`);
  }

  get(id, db = "mongo") {
    return http.get(`/starships/id?id=${id}&db=${db}`);
  }

  find(query, by = "name", db = "mongo", page = 0, userId) {
    return http.get(`/starships?${by}=${query}&db=${db}&page=${page}&userId=${userId}`);
  }

  createStarship(data) {
    return http.post("/review-new", data);
  }

  getStarshipClasses() {
    return http.get("/starships/classes");
  }
}

export default new StarshipsDataService();
