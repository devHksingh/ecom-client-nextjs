import { configureStore } from "@reduxjs/toolkit"
import authReducer from './features/user/authSlice'
import userReducer from './features/user/userSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth:authReducer,
            user:userReducer
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']