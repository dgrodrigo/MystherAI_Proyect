import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

// Interceptor: si la sesión expira (401/403), redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
