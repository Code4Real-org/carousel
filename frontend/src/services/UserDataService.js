import http from "../http-common";

class UserDataService {
  signin(token) {
    return http.post("/user/signin", token)
  }

  update(data) {
    return http.update("/user", data);
  }
}

export default new UserDataService()