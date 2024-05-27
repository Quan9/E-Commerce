import {publicRequest, userRequest } from "./commonMethods";

const API_URL = '/model'

export const createModel = (data) =>{
    userRequest.interceptors.request.use(config =>{
        config.headers.post['Content-Type'] = 'multipart/form-data'
        return config;
    })
    return userRequest.post('/create',data);
}