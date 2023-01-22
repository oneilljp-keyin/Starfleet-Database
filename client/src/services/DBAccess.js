import axios from "axios";
import http from "../http-common";

class DataService {
  getAll(category, page = 0) {
    return http.get(`/${category}?page=${page}`);
  }

  getOne(category, id) {
    return http.get(`/${category}?id=${id}`);
  }

  find(category, nameQuery, classQuery="All", timeFrame = "All", pageNumber = "0", cancel) {
    let query = `/${category}?name=${nameQuery}&page=${pageNumber}`;
    if (category === "starships") (query += `&class=${classQuery}&timeframe=${timeFrame}&starshipsPerPage=50`);
    return http.get(query, {
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });
  }

  create(category, subjectInfo) {
    return http.post(`/${category}`, subjectInfo);
  }

  update(category, subjectInfo) {
    return http.put(`/${category}`, subjectInfo);
  }

  delete(category, subjectId) {
    return http.delete(`/${category}?id=${subjectId}`);
  }

  getStarshipClasses(query = "") {
    return http.get(`/classes?search=${query}`);
  }

  getCategoryCount(category) {
    return http.get(`/counts?category=${category}`);
  }
}

export default new DataService();
