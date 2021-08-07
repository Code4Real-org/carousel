import axios from "axios";
import store from "./store"

const access_token = store.state.activeUser.access_token;

export default axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json",
    "x-access-token": access_token
  }
});
