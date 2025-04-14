import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: number;
  quantity: number;
}

const initialState: CartItem[] = [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const existingProduct = state.find(
        (item) => item.productId === productId
      );
      if (existingProduct) {
        existingProduct.quantity = quantity;
      } else {
        state.push({ productId, quantity: 1 });
      }
    },
    removeCartProduct: (
      state,
      action: PayloadAction<{ productId: number }>
    ) => {
      return state.filter(
        (item) => item.productId !== action.payload.productId
      );
    },
    removeProductQuantity: (
      state,
      action: PayloadAction<{ productId: number }>
    ) => {
      const existingProduct = state.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingProduct) {
        const quantity = existingProduct.quantity;
        if (quantity === 1) {
          return state.filter(
            (item) => item.productId !== action.payload.productId
          );
        } else if (quantity > 1) {
          existingProduct.quantity -= 1;
        }
      }
    },
    clearCart: () => {
      return [];
    },
  },
});

export const { addCart, clearCart, removeCartProduct, removeProductQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
