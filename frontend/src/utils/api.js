
import axios from 'axios';

const API = axios.create({
    baseURL: "https://taskmanager-1-f9e7.onrender.com/api"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token){
        req.headers.authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
