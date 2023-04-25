import axios from 'axios'

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

axiosClient.interceptors.request.use((config) => {
    return config
},
    (error) => {
        return Promise.reject(error)
    }
)

axiosClient.interceptors.response.use((config) => {
    return config.data
},
    (error) => {
        return Promise.reject(error)
    }
)


export default axiosClient