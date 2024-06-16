import axios from "axios";
const BASE_URL = "/api";
const TOKEN = JSON.parse(localStorage.getItem("user"))?.accessToken || null;
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    token: TOKEN,
    id: JSON.parse(localStorage.getItem("user"))?._id,
  },
});
