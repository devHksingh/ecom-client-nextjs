import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface wishlistProps {
    productId: string;
    quantity: number;
    imageUrl: string;
    title: string;
    price: number;
    brand: string;
}

const initialState: wishlistProps[] = []

const wishListSlice = createSlice({
    name: 'wishList',
    initialState,
    reducers: {
        addProductToWishList: (state, action: PayloadAction<{
            productId: string;
            quantity: number;
            imageUrl: string;
            title: string;
            price: number;
            brand: string;
        }>) => {
            const { productId, quantity, brand, imageUrl, price, title } =
                action.payload;
            const existingProduct = state.find((item) => item.productId === action.payload.productId)
            if (!existingProduct) {
                state.push({ productId, quantity, brand, imageUrl, price, title });
            }
        },
        removeProductFromWishlist: (state, action: PayloadAction<{ productId: string }>) => {
            return state.filter((item) => item.productId !== action.payload.productId)
        }
    }
})

export const { addProductToWishList, removeProductFromWishlist } = wishListSlice.actions
export default wishListSlice.reducer