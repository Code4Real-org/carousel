import axios from "axios";
import store from "./store"

const token = store.state.activeUser.accessToken;

const http = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json",
    "x-access-token": token
  }
});
/*
http.interceptors.request.use (
  function (config) {
    const token = store.state.activeUser.access_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject (error);
  }
);
*/
export default http;