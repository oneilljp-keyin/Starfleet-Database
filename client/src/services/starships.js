import http from "../http-common";

class StarshipsDataService {
  getAll(page = 0, db = "mongo") {
    return http.get(`starships?page=${page}&db=${db}`);
  }

  get(id, db = "mongo") {
    return http.get(`/starships/id?id=${id}&db=${db}`);
  }

  find(query, by = "name", db = "mongo", userId) {
    return http.get(`/starships?${by}=${query}&db=${db}&userId=${userId}`);
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
