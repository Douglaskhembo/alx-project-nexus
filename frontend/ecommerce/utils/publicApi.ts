import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export default publicApi;
