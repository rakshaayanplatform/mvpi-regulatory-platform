import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8001", // Use env variable for auth service with fallback
  withCredentials: true, // If using cookies/session
});

// Debug: Log the baseURL being used
console.log('Axios API BaseURL:', process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8001");

// Add request interceptor to include access token
api.interceptors.request.use(
  (config) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('adminAccessToken');
    if (accessToken && accessToken !== 'authenticated') {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 

// const api_auth = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL || "http://localhost:8001/", // Use env variable for auth service with fallback
//   withCredentials: true, // If using cookies/session
// });

// const api_patient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_PATIENT_URL || "http://localhost:8002/", // Use env variable for patient service with fallback
//   withCredentials: true, // If using cookies/session
// });

// const api_coordinator = axios.create({
//.
//.
//.
//.
//. Continue the same for all the services
