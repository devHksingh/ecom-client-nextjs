
import { getAccessToken, getRefreshToken } from "@/utils/token";
import axios from "axios";

export interface MultilpeProductProps {
    id: string,
    quantity: number
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
    headers: {
        'Content-Type': 'application/json'
    }
})


api.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (accessToken && refreshToken) {
            config.headers.Authorization = accessToken;
            config.headers.refreshToken = refreshToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

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

const homePageProduct = async () => {
    const res = await api.get('/api/v1/products/product')
    return res
}

const userCustomizeProduct = async () => {
    const res = await api.get('/api/v1/products/customizeProduct')
    return res
}
const fetchProductByCategoryWithLimit = async (data: { limit: number, skip: number, category: string[] }) => {
    return api.post('/api/v1/products/getProductByCategoryWithLimit', data)
}

const getCart = async () => {
    const res = await api.get('/api/v1/cart/getCart')
    return res
}

const addToCart = async (data: {
    productId: string,
    quantity: number
}) => {
    const response = await api.post('/api/v1/cart/addCartProduct', data)
    return response
}

const multilpeProductAddToCart = async (data: { id: string, quantity: number }[]) => {
    const response = await api.post('/api/v1/cart/multilpeProductAddToCart', data)
    return response
}

const removeFromCart = async (data: { productId: string }) => {
    const response = await api.post('/api/v1/cart/removeFromCart', data)
    return response
}

const updateCartQuantity = async (data: { productId: string, quantity: number, type: string }) => {
    const response = await api.post('/api/v1/cart/updateCartProduct', data)
    return response
}

const addToWishlist = async (data: { productId: string }) => {
    const response = await api.post('/api/v1/wishList/addToWishlist', data)
    return response
}
const removeWishlist = async (data: { productId: string }) => {
    const response = await api.post('/api/v1/wishList/removeWishlist', data)
    return response
}

const getStatusmultipleProduct = async (data: { productId: string, quantity: number }[]) => {
    const response = await api.post('/api/v1/products/getStatusmultipleProduct', data)
    return response
}

const getUser = async () => {
    const response = await api.get('/api/v1/users/getuser')
    return response
}
const updateAddress = async (data: { address: string, pinCode: string, phoneNumber: string }) => {
    const response = await api.post('/api/v1/users/updateAddress', data)
    return response
}

const placeMultipleOrder = async (data: { productId: string, quantity: number }[]) => {
    const response = await api.post('/api/v1/orders/placeMultipleOrder', data)
    return response
}
const clearCart = async () => {
    const response = await api.get('/api/v1/cart/clearCart')
    return response
}

const getAllOrders = async () => {
    const response = await api.get('/api/v1/orders/getOrder')
    return response
}
const getWishlist = async () => {
    const response = await api.get('/api/v1/wishList/getWishlist')
    return response
}
const forcedLogout = async () => {
    const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
    const userId = userSessionData.id
    const data = { userId: userId }
    const response = await api.post('/api/v1/users/forcedLogout', data);
    return response;
}

const multipleProductAddToWishList = async (data: [{ id: string }]) => {
    const response = await api.post('/api/v1/wishList/multipleProductAddToWishList', data);
    return response;
}

export {
    registerUser,
    login,
    logoutUser,
    homePageProduct,
    userCustomizeProduct,
    fetchProductByCategoryWithLimit,
    getCart,
    addToCart,
    multilpeProductAddToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeWishlist,
    getStatusmultipleProduct,
    getUser,
    updateAddress,
    placeMultipleOrder,
    clearCart,
    getAllOrders,
    forcedLogout,
    getWishlist,
    multipleProductAddToWishList
}