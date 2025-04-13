import axios from "axios";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
    headers: {
        'Content-Type': 'application/json'
    }
})

const registerUser = async (data: { email: string; password: string; name: string; confirmPassword: string }) => {
    console.log("BACKEND_URL", process.env.NEXT_PUBLIC_BACKEND_URL);
    console.log("data", data);

    return api.post('/api/v1/users/register', data)
}
const login = async (data: { email: string; password: string }) => {
    return api.post('/api/v1/users/login', data)
}
// logout api

const logoutUser = async () => {
    return api.post('/api/v1/users/logout')
}

export {
    registerUser,
    login,
    logoutUser
}