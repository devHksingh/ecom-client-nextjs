'use client'
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addUserDetails } from "@/lib/store/features/user/authSlice";
import { useEffect } from "react";
// import { useRouter } from "next/navigation";

const useAuth = () => {
    const dispatch = useAppDispatch()
    const userReduxState = useAppSelector((state) => state.auth)
    const { accessToken, isLogin } = userReduxState
    useEffect(() => {
        if (!accessToken || !isLogin) {
            const userData = JSON.parse(sessionStorage.getItem('user') || '{}')
            if (userData.accessToken) {
                const { id, name, email, accessToken, refreshToken } = userData
                dispatch(addUserDetails({ isLogin: true, accessToken, refreshToken, userId: id, useremail: email, userName: name }))

            }
        }
    }, [accessToken, dispatch, isLogin])
}

export default useAuth

/*
const store = useAppStore()
    const {auth}= store.getState()
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}')
    // const router = useRouter()
    const dispatch = useAppDispatch()
    let isLogin = false
    
    // 1.check if islogin in redux state if not check session 
    // 2.if not redirect to login page
    // 3.if session have user info then update redux state

    
    if(!auth.isLogin && !auth.accessToken && !auth.refreshToken){
        if(userData.accessToken){
            const {id,name,email,accessToken,refreshToken} = userData
            dispatch(addUserDetails({isLogin:true, accessToken, refreshToken, userId:id, useremail:email, userName:name}))
            isLogin = true
        }
    }
    console.log(auth.isLogin);
    return isLogin

*/
