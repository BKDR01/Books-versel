import axios from "axios";

const API = axios.create({
    baseURL: "https://lib.qaxramonov.uz/api/v1",
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginUser = (data) => API.post("/admin-auth/login", data);
export const addBook = (data) => API.post("/admin/books/add", data);
export const addNews = (data) => API.post("/news/add", data);
export const getStatistic = () => API.get(`/admin-auth/statistics`);
export const getNewsById = (id) => API.get(`/news/${id}`);
export const getAllAdminNews = (params) => API.get("/news/get/all", { params });
export const deleteNews = (id) => API.delete(`/news/${id}`);
export const getAllLikes = () => API.get("/likes/likes/all");
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateNews = (id, data) =>
    API.patch(`/news/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });