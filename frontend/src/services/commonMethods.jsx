import axios from "axios";
const BASE_URL = "/api";
const TOKEN = JSON.parse(localStorage.getItem("user"))?.accessToken || null;
const url = "https://e-commerce-backend-studentquan9-9b1574ae.koyeb.app";
export const publicRequest = axios.create({
  baseURL: url + BASE_URL,
});

export const userRequest = axios.create({
  baseURL: url + BASE_URL,
  headers: {
    token: TOKEN,
    id: JSON.parse(localStorage.getItem("user"))?._id,
  },
});
