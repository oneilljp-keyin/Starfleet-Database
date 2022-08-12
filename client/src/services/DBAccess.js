import axios from "axios";
import http from "../http-common";

class DataService {
  getAll(category, page = 0) {
    return http.get(`/${category}?page=${page}`);
  }

  getOne(category, id) {
    return http.get(`/${category}?id=${id}`);
  }

  find(category, nameQuery, classQuery="All", pageNumber = "0", cancel) {
    let query = `/${category}?name=${nameQuery}&page=${pageNumber}`;
    if (category === "starships") (query += `&class=${classQuery}&starshipsPerPage=50`);
    console.log(query);
    return http.get(query, {
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });
  }

  create(category, systemInfo) {
    return http.post(`/${category}`, systemInfo);
  }

  update(category, systemInfo) {
    return http.put(`/${category}`, systemInfo);
  }

  delete(category, systemId) {
    return http.delete(`/${category}?id=${systemId}`);
  }

  getStarshipClasses(query = "") {
    return http.get(`/classes?search=${query}`);
  }
}

export default new DataService();
