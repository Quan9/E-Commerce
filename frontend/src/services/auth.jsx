import { publicRequest, userRequest } from "./commonMethods";
const API_URL = "/auth";

export const register = (details) => {
  return publicRequest.post(API_URL + "/register", details);
};
export const registerGoogle = (details) => {
  return publicRequest.post(API_URL + "/registerGoogle", details);
};

export const login = async (user) => {
  return publicRequest.post(API_URL + "/login", user);
};
export const googleLogin = async (email) => {
  return publicRequest.post(API_URL + "/loginGoogle", email);
};
export const verifyEmail = (details) => {
  return publicRequest.post(API_URL + "/verifyEmail", details);
};
