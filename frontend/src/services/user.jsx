import { publicRequest, userRequest } from "./commonMethods";

const API_URL = "/users";
export const getAllUsers = () => {
  return userRequest.get(API_URL);
};
export const deleteUser = (id, data) => {
  return userRequest.delete(API_URL + `/${id}`, data);
};
export const getSingleUser = (id) => {
  return userRequest.get(API_URL + `/find/${id}`);
};
export const editUser = (id, data) => {
  return userRequest.put(API_URL + `/${id}`, data);
};
export const getUserStats = () => {
  return userRequest.get(API_URL + "/stats");
};
export const updateNoti = (id, data) => {
  return userRequest.put(API_URL + "/noti" + `/${id}`, data);
};
export const getAnoUser = (data) => {
  return publicRequest.get(API_URL + `/ano`, { params: data });
};
