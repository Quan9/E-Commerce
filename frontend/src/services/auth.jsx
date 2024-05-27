import {publicRequest, userRequest } from "./commonMethods";
const API_URL = "/auth";

export const register = (details) => {
  return publicRequest.post(API_URL + "/register", details);
};

export const login = async (user) => {
  return publicRequest.post(API_URL + "/login", user);
};
