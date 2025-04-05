import { configureStore } from "@reduxjs/toolkit"
import authReducer from './features/user/authSlice'
import userReducer from './features/user/userSlice'
import wishListReducer from './features/wishlist/wishlistSlice'
import cartReducer from './features/cart/cartSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth:authReducer,
            user:userReducer,
            cart:cartReducer,
            wishList:wishListReducer
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']