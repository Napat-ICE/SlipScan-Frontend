import axios from 'axios';

// ใช้ relative path → nginx proxy จะส่งต่อไปที่ backend:8000 อัตโนมัติ
// ไม่ต้องกังวล CORS เพราะทุก request ผ่าน origin เดียวกัน
const API_BASE = '';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('slipscan_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
