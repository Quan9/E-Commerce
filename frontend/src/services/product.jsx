import { publicRequest, userRequest } from "./commonMethods";

const API_URL = "/products";
export const getAllProducts = () => {
  return userRequest.get(API_URL + "/admin");
};
export const getAllPublicProducts = () => {
  return publicRequest.get(API_URL);
};
export const getProductByCategory = (cat, query) => {
  return publicRequest.get(API_URL + `/${cat}`, { params: query });
};
export const createProduct = (data) => {
  return userRequest.post(API_URL, data);
};
export const deleteProduct = (id) => {
  return userRequest.delete(API_URL + `/${id}`);
};
export const editProduct = (id, data) => {
  return userRequest.put(API_URL + `/${id}`, data);
};
export const getProduct = (id) => {
  return publicRequest.get(API_URL + `/find/${id}`);
};
export const createProductReview = (id, data) => {
  return publicRequest.put(API_URL + `/${id}/review`, data);
};
