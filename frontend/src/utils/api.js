import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
      ? "https://taskmanager-2mm5.onrender.com/api"
      : "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token){
        req.headers.authorization = `Bearer ${ token}`;
    }
    return req;
});

export default API;
