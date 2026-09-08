import axios from 'axios';

// In production when the frontend is served by the backend (same origin)
// we want to use a relative `/api` path. During development we keep the
// localhost fallback so the dev server can call the backend running separately.
const DEFAULT_API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:5002' : '';
const API_BASE_URL = `${(import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE).replace(/\/$/, '')}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

