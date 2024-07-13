import { publicRequest, userRequest } from "./commonMethods";
const API_URL = "/chat";
export const getAllChats = () => {
  return userRequest.get(API_URL);
};
export const clientChat = (id) => {
  return publicRequest.get(API_URL + `/client/${id}`, );
};
export const chatReadBy = (id, query) => {
  return userRequest.get(API_URL + `/agent/${id}`, query);
};
export const getChat = (id) => {
  return userRequest.get(API_URL + `/agent/get/${id}`);
};
