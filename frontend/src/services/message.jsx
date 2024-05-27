import { publicRequest, userRequest } from "./commonMethods";
const API_URL = "/message";
export const getAllMessages = (id) => {
  return publicRequest.get(API_URL + `/${id}`);
};
export const sendMessage = (query) => {
  return publicRequest.post(API_URL, query);
};
export const agentMessage = (id) => {
  return userRequest.get(API_URL + `/agent/${id}`);
};
