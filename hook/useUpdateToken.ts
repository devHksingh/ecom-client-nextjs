import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { updateAccessToken } from "@/lib/store/features/user/authSlice"

interface props {
    accessToken: string
}

const useUpdateToken = ({ accessToken }: props) => {
    const userState = useAppSelector((state) => state.auth)
    const { refreshToken, userName, userId, useremail } = userState
    const dispatch = useAppDispatch()
    const user = { id: userId, name: userName, email: useremail, refreshToken, accessToken }
    sessionStorage.clear()
    sessionStorage.setItem("user", JSON.stringify(user))
    dispatch(updateAccessToken({ accessToken }))

}

export default useUpdateToken