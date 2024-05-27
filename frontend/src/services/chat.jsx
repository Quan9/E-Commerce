import { publicRequest, userRequest } from "./commonMethods";
const API_URL = "/chat";
export const getAllChats = () => {
  return userRequest.get(API_URL);
};
export const clientChat = (id, query) => {
  return publicRequest.get(API_URL + `/client/${id}`, { params: query });
};
export const chatReadBy = (id, query) => {
  return userRequest.get(API_URL + `/agent/${id}`, query);
};
