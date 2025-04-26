"use client";

import useToast from "@/hook/useToast";
import { addToCart, getCart, multilpeProductAddToCart } from "@/http/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateAccessToken } from "@/lib/store/features/user/authSlice";
import { ProductProps } from "@/types/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
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
  id: string;
  quantity: number;
}
interface GetCartProps{
  accessToken?:string,
  cart:{
    user:string,
    totalItems:number,
    totalAmount:number,
    items:[
      product:ProductProps
    ]
  }
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

 

  const { data } = useQuery({
    queryKey: ["cartProducts"],
    queryFn: getCart,
    // TODO: ADD STALE TIME
    refetchIntervalInBackground: true,
    enabled: !isNewProductAddedToCart && isLogin,
  });

  if(data as AxiosResponse){
    console.log(data)
    
    if(data?.data.accessToken){
      dispatch(updateAccessToken({accessToken:data.data.accessToken}))
    }
  }
  

  useEffect(()=>{
    function synclocalstorageCart(){
      const loginUserCart = JSON.parse(localStorage.getItem("loginUserCart") || "[]")
      const logoutUserCart = JSON.parse(localStorage.getItem("logoutUserCart")|| "[]")
      const cartProducts:apiCartProducts[] =[]
      // if cartState
      const reduxCartProducts:apiCartProducts[] = []
      cartState.map((product)=>{
        const id = product.productId
        const quantity = product.quantity
        reduxCartProducts.push({id,quantity})
      })
      // compare redux state and localstorage
      
      if(reduxCartProducts.length === 0){
        
        
        if(loginUserCart.length>0){
          // cartProducts.push(loginUserCart)
          cartProducts.push(...loginUserCart);
        }
        if(logoutUserCart.length>0){
          // cartProducts.push(logoutUserCart)
          cartProducts.push(...logoutUserCart)
        }
       
      }else{
        
        if(loginUserCart.length>0){
          loginUserCart.forEach((product:apiCartProducts)=>{
            const exist = reduxCartProducts.some((item:apiCartProducts)=>item.productId === product.productId)
            if(!exist){
              reduxCartProducts.push(product)
            }
          })
        }
        
        if(logoutUserCart.length>0){
          logoutUserCart.forEach((product:apiCartProducts)=>{
            const exist = reduxCartProducts.some((item:apiCartProducts)=> item.productId === product.productId)
            if(!exist){
              reduxCartProducts.push(product)
            }
          })
        }
      }
      console.log("cartProducts",cartProducts);
      
      return cartProducts
    }
    if(cartState){
      const products = synclocalstorageCart()
      console.log("setCartStateProducts",products);
      
      setCartStateProducts(products)
    }
  },[cartState])

  useEffect(() => {
    console.log("cart page", cartState);
  }, [cartState]);
  console.log("cartState", cartState);

  const mutation = useMutation({
    mutationFn:multilpeProductAddToCart,
    onSuccess:(response)=>{
      console.log("response mutation",response);
      
    }
  })
  // useEffect(() => {
  //   if (isLogin && cartStateProducts.length>0) {
  //     console.log("cartStateProducts.length",cartStateProducts.length);
  //     console.log("cartStateProducts.length",cartStateProducts);
  //     // cartStateProducts.map((product)=>{
  //     //   console.log(product);
  //     //   mutation.mutate(product)
  //     // })
  //     mutation.mutate(cartStateProducts)
  //   }
  // }, [isLogin, cartStateProducts]);

  return (
    <div className=" container">
      {cartState.length > 0 ? (
        <div className=" flow-root">
          <ul role="list" className="">
            {cartState.map((product: CartProduct) => (
              <li key={product.productId}>
                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  
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