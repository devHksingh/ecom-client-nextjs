"use client";

import useToast from "@/hook/useToast";
import { getCart } from "@/http/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface CartProduct {
  productId: string;
  brand: string;
  imageUrl: string;
  title: string;
  quantity: number;
  price: number;
}

interface apiCartProducts{
  productId: string;
  quantity: number;
}

const CartPage = () => {
  const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isNewProductAddedToCart, setIsNewProductAddedToCart] =
    useState<boolean>(false);
  const [cartStateProducts,setCartStateProducts] = useState<apiCartProducts[]>([])

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
  // useEffect(() => {
  //   if (data) {
  //     console.log("User cart data", data);
  //     setIsNewProductAddedToCart(true);
  //   }
  // }, [data]);
  /*
  check data ? sync with redux and localstorage
  fix sync data on refresh
 add to cart api
  */
  // const localStorageKey = isLogin ? "loginUserCart" : "logoutUserCart";
  // const localStorageKey = isLogin ? "loginUserWishlist" : "logoutUserWishlist";
  

  useEffect(()=>{
    function syncCart(){
      const loginUserCart = JSON.parse(localStorage.getItem("loginUserCart") || "[]")
      const logoutUserCart = JSON.parse(localStorage.getItem("logoutUserCart")|| "[]")
      const cartProducts:apiCartProducts[] =[]
      // if cartState
      const reduxCartProducts:apiCartProducts[] = []
      cartState.map((product)=>{
        const id = product.productId
        const quantity = product.quantity
        reduxCartProducts.push({productId:id,quantity})
      })
      // compare redux state and localstorage
      if(reduxCartProducts.length === 0){
        cartProducts.push(loginUserCart)
        cartProducts.push(logoutUserCart)
      }else{
        
        loginUserCart.forEach((product:apiCartProducts)=>{
          const exist = reduxCartProducts.some((item:apiCartProducts)=>item.productId === product.productId)
          if(!exist){
            reduxCartProducts.push(product)
          }
        })
        logoutUserCart.forEach((product:apiCartProducts)=>{
          const exist = reduxCartProducts.some((item:apiCartProducts)=> item.productId === product.productId)
          if(!exist){
            reduxCartProducts.push(product)
          }
        })
      }
      return cartProducts
    }
    if(cartState){
      const products = syncCart()
      console.log("setCartStateProducts",products);
      
      setCartStateProducts(products)
    }
  },[cartState])

  useEffect(() => {
    console.log("cart page", cartState);
  }, [cartState]);
  console.log("cartState", cartState);

  return (
    <div className=" container">
      {cartState.length > 0 ? (
        <div className=" flow-root">
          <ul role="list" className="">
            {cartState.map((product: CartProduct) => (
              <li key={product.productId}>
                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  {/* <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="size-full object-cover"
                  /> */}
                  <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="size-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No Product in cart</div>
      )}
    </div>
  );
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
