import axios from 'axios';

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;

// export const setAuthToken = (token) => {
//   if (token) {
//     localStorage.setItem("token", token);
//     instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     localStorage.removeItem("token");
//     delete instance.defaults.headers.common["Authorization"];
//   }
// };