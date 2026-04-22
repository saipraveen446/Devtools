import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const API = axios.create({
    baseURL: API_BASE_URL
});

export default API;
export { API_BASE_URL };