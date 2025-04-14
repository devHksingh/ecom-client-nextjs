import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type ToastType = "success" | "error" | "info" | "default";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  content: string;
  duration: number;
}

const initialState: ToastProps[] = [];

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (
      state,
      action: PayloadAction<{
        type: ToastType;
        title: string;
        content: string;
        duration?: number;
      }>
    ) => {
      const { type, title, content, duration = 5000 } = action.payload;
      state.push({
        id: uuidv4(),
        type,
        title,
        content,
        duration,
      });
    },
    removeToast: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      return state.filter((toast) => toast.id !== id);
    },
  },
});

export const {addToast,removeToast} = toastSlice.actions
export default toastSlice.reducer