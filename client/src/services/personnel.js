import http from "../http-common";

class PersonnelDataService {
  getAll(page = 0) {
    return http.get(`/personnel?page=${page}`);
  }

  get(id) {
    return http.get(`/personnel/id/${id}`);
  }

  find(query, by = "name", page = 0) {
    return http.get(`/personnel?${by}=${query}&page=${page}`);
  }

  createPersonnel(data) {
    return http.post("/review-new", data);
  }

  updatePersonnel(data) {
    return http.put("/review-edit", data);
  }

  deletePersonnel(id, userID) {
    return http.delete(`/review-delete?id=${id}`, { data: { user_id: userID } });
  }
}

export default new PersonnelDataService();
