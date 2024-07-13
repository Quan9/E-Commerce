import { publicRequest, userRequest } from "./commonMethods";

const API_URL = "/orders";
export const newOrder = (data) => {
  return publicRequest.post(API_URL + "/", data);
};
export const getAllOrder = () => {
  return userRequest.get(API_URL + "/");
};
export const getSingleOrder = (id) => {
  return userRequest.get(API_URL + `/single/${id}`);
};
export const getUserOrder = (id) => {
  return userRequest.get(API_URL + `/find/${id}`);
};
export const updateOrder = (id, data) => {
  return userRequest.put(API_URL + `/${id}`, data);
};
export const deleteOrder = (id) => {
  return userRequest.delete(API_URL + `/${id}`);
};
export const getOrdersPerMonth = () => {
  console.log(userRequest);
  return userRequest.get(API_URL + "/income");
};
