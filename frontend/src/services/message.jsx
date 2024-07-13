import { publicRequest, userRequest } from "./commonMethods";
const API_URL = "/message";
export const getAllMessages = (id, query) => {
  return publicRequest.get(API_URL + `/${id}`, {
    params: { total: query.total, user: query.user },
  });
};
export const sendMessage = (query) => {
  return publicRequest.post(API_URL, query);
};
export const agentMessage = (id, query) => {
  return userRequest.get(API_URL + `/agent/${id}`, {
    params: { total: query },
  });
};
export const updateChatRead = (id, query) => {
  return publicRequest.get(API_URL + `/updatemessage/${id}`, { params: query });
};
