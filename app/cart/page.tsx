"use client";

import useToast from "@/hook/useToast";
import { addToCart, getCart, multilpeProductAddToCart, removeFromCart } from "@/http/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateAccessToken } from "@/lib/store/features/user/authSlice";
import { ProductProps } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartProduct {
  productId: string;
  brand: string;
  imageUrl: string;
  title: string;
  quantity: number;
  price: number;
  currency: string;
}

interface CartItemsPostReqProps {
  product: ProductProps;
  quantity: number;
}

interface apiCartProducts {
  id: string;
  quantity: number;
}
interface GetCartProps {
  accessToken?: string;
  cart: {
    user: string;
    totalItems: number;
    totalAmount: number;
    items: [product: ProductProps];
  };
}
const CartPage = () => {
  const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [fetchCartproduct, setFetchCartProduct] = useState(true);
  const [isNewProductAddedToCart, setIsNewProductAddedToCart] =
    useState<boolean>(false);
  const [cartProducts, setCartProducts] = useState<CartItemsPostReqProps[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [cartStateProducts, setCartStateProducts] = useState<apiCartProducts[]>(
    []
  );
  const queryClient = useQueryClient();
  const router = useRouter();
  const userState = useAppSelector((state) => state.auth);
  const cartState = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  if (cartState) {
    console.log("cartState", cartState);
  }
  const { isLogin } = userState;
  const formatPrice = (amount: number, currency: string) => {
    let formatedPrice: string;
    switch (currency) {
      case "USD":
        formatedPrice = `${"$"}${amount}`;
        break;
      case "EUR":
        formatedPrice = `${"$"}${amount}`;
        break;
      case "INR":
        formatedPrice = `${"₹"}${amount}`;
        break;
      case "RUB":
        formatedPrice = `${"₽"}${amount}`;
        break;
      case "GBP":
        formatedPrice = `${"£"}${amount}`;
        break;
      default:
        formatedPrice = `${"₹"}${amount}`;
        break;
    }
    return formatedPrice;
  };
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
      toast.error("You are not login!", "Kindly sign in to access cart.");
      router.push("/login");
    }
  }, [authChecked, isLogin, router, toast]);

  const { data } = useQuery({
    queryKey: ["cartProducts"],
    queryFn: getCart,

    refetchIntervalInBackground: true,
    enabled: fetchCartproduct && isLogin,
  });

  // if (data as AxiosResponse) {
  //   console.log("getCart---", data);
  //   const cartProducts: CartItemsPostReqProps[] = [];

  //   if (data?.data) {
  //     const { isAccessTokenExp, cart } = data.data;
  //     if (isAccessTokenExp) {
  //       const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  //       const { accessToken: newAccessToken } = data.data;
  //       dispatch(updateAccessToken({ accessToken: newAccessToken }));
  //       const { email, id, name, refreshToken } = user;
  //       const updatedUserData = {
  //         accessToken: newAccessToken,
  //         email,
  //         id,
  //         name,
  //         refreshToken,
  //       };
  //       sessionStorage.removeItem("user");
  //       sessionStorage.setItem("user", JSON.stringify(updatedUserData));
  //     }
  //     const { items, totalAmount, totalItems } = cart;
  //     items.map((item: CartItemsPostReqProps) => {
  //       const product = item.product;
  //       const quantity = item.quantity;
  //       cartProducts.push({ product, quantity });
  //     });
  //     setCartProducts(cartProducts);
  //     setTotalPrice(totalAmount);
  //     setTotalQuantity(totalItems);
  //   }
  // }
  useEffect(() => {
    if (data as AxiosResponse) {
      console.log("getCart---", data);
      const cartProducts: CartItemsPostReqProps[] = [];
  
      if (data?.data) {
        const { isAccessTokenExp, cart } = data.data;
        if (isAccessTokenExp) {
          const user = JSON.parse(sessionStorage.getItem("user") || "{}");
          const { accessToken: newAccessToken } = data.data;
          dispatch(updateAccessToken({ accessToken: newAccessToken }));
          const { email, id, name, refreshToken } = user;
          const updatedUserData = {
            accessToken: newAccessToken,
            email,
            id,
            name,
            refreshToken,
          };
          sessionStorage.removeItem("user");
          sessionStorage.setItem("user", JSON.stringify(updatedUserData));
        }
        const { items, totalAmount, totalItems } = cart;
        items.map((item: CartItemsPostReqProps) => {
          const product = item.product;
          const quantity = item.quantity;
          cartProducts.push({ product, quantity });
        });
        setCartProducts(cartProducts);
        setTotalPrice(totalAmount);
        setTotalQuantity(totalItems);
      }
    }
  }, [data, dispatch]); 
  

  useEffect(() => {
    function synclocalstorageCart() {
      const loginUserCart = JSON.parse(
        localStorage.getItem("loginUserCart") || "[]"
      );
      const logoutUserCart = JSON.parse(
        localStorage.getItem("logoutUserCart") || "[]"
      );
      const cartProducts: apiCartProducts[] = [];
      // if cartState
      const reduxCartProducts: apiCartProducts[] = [];
      cartState.map((product) => {
        const id = product.productId;
        const quantity = product.quantity;
        reduxCartProducts.push({ id, quantity });
      });
      // compare redux state and localstorage

      if (reduxCartProducts.length === 0) {
        if (loginUserCart.length > 0) {
          // cartProducts.push(loginUserCart)
          cartProducts.push(...loginUserCart);
        }
        if (logoutUserCart.length > 0) {
          // cartProducts.push(logoutUserCart)
          cartProducts.push(...logoutUserCart);
        }
      } else {
        if (loginUserCart.length > 0) {
          loginUserCart.forEach((product: apiCartProducts) => {
            const exist = reduxCartProducts.some(
              (item: apiCartProducts) => item.id === product.id
            );
            if (!exist) {
              reduxCartProducts.push(product);
            }
          });
        }

        if (logoutUserCart.length > 0) {
          logoutUserCart.forEach((product: apiCartProducts) => {
            const exist = reduxCartProducts.some(
              (item: apiCartProducts) => item.id === product.id
            );
            if (!exist) {
              reduxCartProducts.push(product);
            }
          });
        }
      }
      console.log("cartProducts", cartProducts);

      return cartProducts;
    }
    if (cartState) {
      const products = synclocalstorageCart();
      console.log("setCartStateProducts", products);

      setCartStateProducts(products);
    }
  }, [cartState]);

  useEffect(() => {
    console.log("cart page", cartState);
  }, [cartState]);
  console.log("cartState", cartState);

  const mutation = useMutation({
    mutationFn: multilpeProductAddToCart,
    onSuccess: (response) => {
      
      const { isAccessTokenExp, cart } = response.data;
      if (isAccessTokenExp) {
        // TODO: Update token in localStorge and redux state
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const { accessToken: newAccessToken } = response.data;
        dispatch(updateAccessToken({ accessToken: newAccessToken }));
        const { email, id, name, refreshToken } = user;
        const updatedUserData = {
          accessToken: newAccessToken,
          email,
          id,
          name,
          refreshToken,
        };
        sessionStorage.removeItem("user");
        sessionStorage.setItem("user", JSON.stringify(updatedUserData));
      }
      const { items, totalAmount, totalItems } = cart;
      const cartProducts: CartItemsPostReqProps[] = [];

      items.map((item: CartItemsPostReqProps) => {
        const product = item.product;
        const quantity = item.quantity;
        cartProducts.push({ product, quantity });
      });
      setCartProducts(cartProducts);
      setTotalPrice(totalAmount);
      setTotalQuantity(totalItems);
      console.log("cartProducts-----", cartProducts);
      // TODO: DELTE localstorage key for cart both login and logout
      localStorage.removeItem("loginUserCart");
      localStorage.removeItem("logoutUserCart");
      // set false for fetch cart product
      setFetchCartProduct(false);
    },
  });
  useEffect(() => {
    if (isLogin && cartStateProducts.length > 0) {
      console.log("cartStateProducts.length", cartStateProducts.length);
      console.log("cartStateProducts.length", cartStateProducts);

      mutation.mutate(cartStateProducts);
    }
  }, [isLogin, cartStateProducts]);

  const productRemoveMutation = useMutation({
    mutationFn:removeFromCart,
    onSuccess:(response)=>{
      console.log("productRemoveMutation response--",response);
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      setFetchCartProduct(true);
    }
  })

  const handleRemoveProduct = (productId:string)=>{
    productRemoveMutation.mutate({productId})
  }

  return (
    <div className=" container">
      {cartProducts.length>0 && (
        <div className="mt-16 flex flex-col lg:flex-row justify-between">
          <ul
            role="list"
            className="-my-6 divide-y divide-gray-200 space-y-2 lg:w-1/2  p-2"
          >
            {cartProducts.map((item, index) => (
              <li key={index}>
                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    width={50}
                    height={50}
                    priority
                    className="size-full object-contain"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link href={`/products/${item.product._id}`}>
                          {item.product.title}
                        </Link>
                      </h3>
                      <p className="ml-4">
                        {" "}
                        {formatPrice(item.product.price, item.product.currency)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.product.brand}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm mb-4">
                    <p className="text-gray-500">Qty {item.quantity}</p>

                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={()=>handleRemoveProduct(item.product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="lg:w-[42%] mt-6 space-y-6">
            <h3 className="text-gray-900 font-medium text-xl">Order summary</h3>
            <div className="space-y-4 divide-y-2">
              <div className="flex justify-between text-base font-medium text-gray-900 pb-2">
                <p className="">Total Items</p>
                <p>{totalQuantity}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 pb-2">
                <p>Subtotal</p>
                <p>${totalPrice}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 pb-2">
                <p>Shipping estimate</p>
                <p>$ 0</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 pb-2">
                <p>Tax estimate</p>
                <p>$ 0</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 pb-2">
                <p>Order total</p>
                <p>${totalPrice}</p>
              </div>

              <Button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600  text-md">
                CheckOut
              </Button>
            </div>
            <p className="mt-2 text-md">
              <span className="font-bold">Note:</span> Order price is calculated
              on dollar currency{" "}
            </p>
          </div>
        </div>
      )}
      
      
      {cartState.length === 0 && cartProducts.length === 0 && (
        <div className="mt-16">
          <div className="text-center text-2xl text-red-500">No Product in cart</div>
        </div>
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
{/* {cartState.length > 0 ? (
        <div className="mt-16">
          <div className=" flow-root">
            <ul
              role="list"
              className="-my-6 divide-y divide-gray-200 space-y-2"
            >
              {cartState.map((product: CartProduct) => (
                <li key={product.productId}>
                  <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={50}
                      height={50}
                      priority
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link href={`/products/${product.productId}`}>
                            {product.title}
                          </Link>
                        </h3>
                        <p className="ml-4">
                          {" "}
                          {formatPrice(product.price, product.currency)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.brand}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm mb-4">
                      <p className="text-gray-500">Qty {product.quantity}</p>

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>No Product in cart</div>
      )} */}