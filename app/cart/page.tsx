"use client";

import useToast from "@/hook/useToast";
import { getCart } from "@/http/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isNewProductAddedToCart, setIsNewProductAddedToCart] =
    useState<boolean>(false);

  const userState = useAppSelector((state) => state.auth);
  const cartState = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const { isLogin } = userState;
  const toast = useToast();
  // Delaying toast until login status is determined
  useEffect(() => {
    if (typeof isLogin === "boolean") {
      setAuthChecked(true);
    }
  }, [isLogin]);

  useEffect(() => {
    console.log("user login cart page", isLogin);
    if (authChecked && !isLogin) {
      toast.error("You are not login!", "Kindly sign in to get a deal.");
    }
  }, [authChecked, isLogin, toast]);
  
  // useEffect(() => {
  //   console.log("user login cart page", isLogin);
  //   if (!isLogin) {
  //     toast.error("You are not login!", "Kindly sign in to get a deal. ");
  //   }
  // }, [isLogin, toast]);

  const { data } = useQuery({
    queryKey: ["cartProducts"],
    queryFn: getCart,
    // TODO: ADD STALE TIME
    refetchIntervalInBackground: true,
    enabled: !isNewProductAddedToCart && isLogin,
  });
  useEffect(() => {
    if (data) {
      console.log("User cart data", data);
      setIsNewProductAddedToCart(true);
    }
  }, [data]);
  return <div>CartPage</div>;
};

export default CartPage;

// useAuth();
// const { isLogin } = userState;
// useEffect(() => {
  //   if (!isLogin) {
  //     console.log("user login",isLogin);

  //     setIsUserLogin(false);
  //     toast.error("You are not login!", "Kindly sign in to save the cart. ");
  //   }
  //   if (isLogin) {
  //     setIsUserLogin(true);
  //   }
  // }, [isLogin, toast]);
