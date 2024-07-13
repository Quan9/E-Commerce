import axios from "axios";
const BASE_URL = "/api";
const publicRequest = axios.create({
  baseURL: BASE_URL,
});

const userRequest = axios.create({
  baseURL: BASE_URL,
});
userRequest.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      config.headers.token = user?.accessToken;
      config.headers.id = user?._id;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export { userRequest, publicRequest };
