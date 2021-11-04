import axios from "axios"

const api = axios.create({ baseURL: "https://leeminhung.space/api/" })

export const authApi = axios.create({ baseURL: "https://leeminhung.space/api/", headers: {"x-access-token": localStorage.getItem("access_token") }})

export default api