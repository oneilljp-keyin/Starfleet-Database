import http from "../http-common";

class PersonnelDataService {
  getAll(page = 0, db = "mongo") {
    return http.get(`/personnel?page=${page}&db=${db}`);
  }

  get(id, db = "mongo") {
    return http.get(`/personnel/id?id=${id}&db=${db}`);
  }

  find(query, by = "name", db = "mongo", userId) {
    return http.get(`/personnel?${by}=${query}&db=${db}&userId=${userId}`);
  }

  searchHistory(id) {
    return http.get("/personnel/history/", id);
  }

  updatePersonnel(data) {
    return http.put("/review-edit", data);
  }

  deletePersonnel(id, userID) {
    return http.delete(`/review-delete?id=${id}`, { data: { user_id: userID } });
  }
}

export default new PersonnelDataService();
