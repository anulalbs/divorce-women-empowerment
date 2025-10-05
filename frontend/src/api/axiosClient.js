import axios from "axios";
import {store} from "../store"; 
import { logout } from "../store/userSlice";

// Create Axios instance
const axiosClient = axios.create({
  baseURL: "http://localhost:5010/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle 401 / expired tokens
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid / expired
      store.dispatch(logout()); // Clear user session
      window.location.href = "/signin"; // Redirect to signin
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
