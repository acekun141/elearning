import axios from "axios"

const api = axios.create({ baseURL: "https://leeminhung.space:8000/" })

export const authApi = axios.create({ baseURL: "https://leeminhung.space:8000/", headers: {"x-access-token": localStorage.getItem("access_token") }})

export default api