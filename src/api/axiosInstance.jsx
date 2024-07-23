import axios from 'axios'

export const baseURL = import.meta.env.VITE_BASE_URL_API
const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

export default instance;