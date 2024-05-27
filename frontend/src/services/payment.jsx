import {publicRequest, userRequest } from "./commonMethods";

const API_URL = "/stripe";

export const getConfig = () => {
  return publicRequest.get(API_URL + "/config");
};
export const createPaymentIntent = (data) => {

  return publicRequest.post(API_URL + "/create-payment-intent", data);
};
export const retrieveSession = (id) =>{
    return publicRequest.get(API_URL+`/retrieve/${id}`);
}