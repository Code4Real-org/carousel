import http from "../http-common";

class LotteryDataService {
  getAll() {
    return http.get("/lotteries");
  }

  get(id) {
    return http.get(`/lotteries/${id}`);
  }

  create(data) {
    return http.post("/lotteries", data);
  }

  update(id, data) {
    return http.put(`/lotteries/${id}`, data);
  }

  delete(id) {
    return http.delete(`/lotteries/${id}`);
  }

  deleteAll() {
    return http.delete(`/lotteries`);
  }

  findByTitle(title) {
    return http.get(`/lotteries?title=${title}`);
  }
}

export default new LotteryDataService();
