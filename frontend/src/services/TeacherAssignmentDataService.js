import http from "../http-common";

class TeacherAssignmentDataService {
  getAll() {
    return http.get("/teacher/assignments");
  }

  get(id) {
    return http.get(`/teacher/assignments/${id}`);
  }

  create(data) {
    return http.post("/teacher/assignments", data);
  }

  update(id, data) {
    return http.put(`/teacher/assignments/${id}`, data);
  }

  delete(id) {
    return http.delete(`/teacher/assignments/${id}`);
  }

  deleteAll() {
    return http.delete(`/teacher/assignments`);
  }
}

export default new TeacherAssignmentDataService();
