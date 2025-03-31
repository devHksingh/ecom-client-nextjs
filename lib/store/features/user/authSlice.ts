import { createSlice } from "@reduxjs/toolkit"
export interface AuthState {
    isLogin: boolean,
    refreshToken: string,
    accessToken: string,
    userId: string,
    userName: string,
    useremail: string,
}
const initialState: AuthState = {
    isLogin: false,
    accessToken: "",
    refreshToken: "",
    userId: "",
    userName: "",
    useremail: ""
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addUserDetails: (state, action) => {
            const { isLogin, accessToken, refreshToken, userId, useremail, userName } = action.payload
            state.isLogin = isLogin
            state.accessToken = accessToken
            state.refreshToken = refreshToken
            state.userId = userId
            state.userName = userName
            state.useremail = useremail
        },
        updateAccessToken: (state, action) => {
            const { accessToken } = action.payload
            state.accessToken = accessToken
        },
        deleteUser: (state) => {
            state.isLogin = false
            state.accessToken = ""
            state.refreshToken = ""
            state.userId = ""
            state.userName = ""
            state.useremail = ""
        },
    }
})

export const { addUserDetails, deleteUser, updateAccessToken } = authSlice.actions
export default authSlice.reducer