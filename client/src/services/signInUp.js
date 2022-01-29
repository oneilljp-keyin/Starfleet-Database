import http from "../http-common";

class SignInUpService {
  signIn(signInInfo) {
    return http.post("/login", signInInfo);
  }

  userInfo() {
    return http.get(`/login`, {
      headers: { Authorization: `Bearer ${localStorage.token}` },
    });
  }
}

export default new SignInUpService();
