/*
Axios interceptor: automatically add the token to the request headers
*/

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


const api = axios.create({
    // Import anything specified in the .env file
    // In this case it is the base URL of the app
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    /*
    If there is an access token in the local storage, add it to the request headers
    */
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


export default api;