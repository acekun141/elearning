import axios from "axios"

const api = axios.create({ baseURL: "http://localhost:8000/" })

export const authApi = axios.create({ baseURL: "http://localhost:8000/", headers: {"x-access-token": localStorage.getItem("access_token") }})

export default api