import http from "../http-common";

class StarshipsDataService {
  getAll(page = 0) {
    return http.get(`starships?page=${page}`);
  }

  get(id) {
    return http.get(`/starships?id=${id}`);
  }

  find(query, by = "name", page = 0) {
    return http.get(`starships?${by}=${query}&page=${page}`);
  }

  createStarship(data) {
    return http.post("/review-new", data);
  }

  updateStarship(data) {
    return http.put("/review-edit", data);
  }

  deleteStarship(id, userID) {
    return http.delete(`review-delete?id=${id}`, { data: { user_id: userID } });
  }

  getStarshipClasses() {
    return http.get("/starships/classes");
  }
}

export default new StarshipsDataService();
