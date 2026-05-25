import axios from "axios"

const api= axios.create({
    baseURL: 'http://26.11.41.172:5000/',
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // hoặc lấy từ context

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export default api