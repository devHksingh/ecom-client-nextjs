import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface UserProps {
    address: string,
    phoneNumber: string,
    pincode: string
}

const initialState: UserProps = {
    address: "",
    phoneNumber: "",
    pincode: ""
}

export const userInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        addInfo: (state, action: PayloadAction<{ address: string, phoneNumber: string, pincode: string }>) => {
            const { address, phoneNumber, pincode } = action.payload
            state.address = address
            state.phoneNumber = phoneNumber
            state.pincode = pincode
        },
        updateAddress: (state, action: PayloadAction<{ address: string, pincode: string }>) => {
            state.address = action.payload.address
            state.pincode = action.payload.pincode
        },
        updatePhoneNumber: (state, action: PayloadAction<{ phoneNumber: string }>) => {
            state.phoneNumber = action.payload.phoneNumber
        },
    }
})

export const { addInfo, updateAddress, updatePhoneNumber } = userInfoSlice.actions
export default userInfoSlice.reducer