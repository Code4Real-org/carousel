import http from "../http-common";

class UserDataService {
//   get(gid) {
//     return http.get(`/users/${gid}`);
//   }

  create(data) {
    return http.post("/users", data);
  }

//   delete(gid) {
//     return http.delete(`/users/${gid}`);
//   }

//   deleteAll() {
//     return http.delete(`/users`);
//   }

//   findByGid(gid) {
//     return http.get(`/users?gid=${gid}`);
//   }
}

export default new UserDataService();
