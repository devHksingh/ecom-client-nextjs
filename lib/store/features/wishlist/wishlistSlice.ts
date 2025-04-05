import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface wishlistProps {
    productId: number
}

const initialState: wishlistProps[] = []

const wishListSlice = createSlice({
    name: 'wishList',
    initialState,
    reducers: {
        addProductToWishList: (state, action: PayloadAction<{ productId: number }>) => {
            const existingProduct = state.find((item) => item.productId === action.payload.productId)
            if (!existingProduct) {
                state.push({ productId: action.payload.productId })
            }
        },
        removeProductFromWishlist: (state, action: PayloadAction<{ productId: number }>) => {
            return state.filter((item) => item.productId !== action.payload.productId)
        }
    }
})

export const { addProductToWishList, removeProductFromWishlist } = wishListSlice.actions
export default wishListSlice.reducer