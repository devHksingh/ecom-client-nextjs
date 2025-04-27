"use client";
import useToast from "@/hook/useToast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addCart,
  removeCartProduct,
} from "@/lib/store/features/cart/cartSlice";
import { Heart, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  addProductToWishList,
  removeProductFromWishlist,
} from "@/lib/store/features/wishlist/wishlistSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { multilpeProductAddToCart, removeFromCart } from "@/http/api";
import { updateAccessToken } from "@/lib/store/features/user/authSlice";


interface ProductBtnProps {
  id: string;
  brand: string;
  title: string;
  imageUrl: string;
  currency: string;
  totalStock: number;
  price: number;
}
interface CartProducts {
  id: string;
  quantity: number;
}
interface WishListProducts {
  id: string;
}

const ProductBtn = ({
  id,
  brand,
  title,
  imageUrl,
  totalStock,
  price,
}: ProductBtnProps) => {
  const [isProductAddedToCart, setIsProductAddedToCart] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isProductAddedToWishlist, setIsProductAddedToWishlist] =
    useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const userState = useAppSelector((state) => state.auth);
  const cartState = useAppSelector((state) => state.cart);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const toast = useToast();

  const { isLogin } = userState;
  // Delaying toast until login status is determined
  useEffect(() => {
    if (typeof isLogin === "boolean") {
      setAuthChecked(true);
    }
  }, [isLogin]);

  useEffect(() => {
    const localStorageKey = isLogin ? "loginUserCart" : "logoutUserCart";
    const localWishlistKey = isLogin
      ? "loginUserWishlist"
      : "logoutUserWishlist";
    const authCart = JSON.parse(
      localStorage.getItem(localStorageKey) || "[]"
    ) as { id: string; quantity: number }[];
    const authWishlist = JSON.parse(
      localStorage.getItem(localWishlistKey) || "[]"
    ) as { id: string }[];
    const localStorageCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as { productId: string; quantity: number }[];
    const localwishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    ) as { productId: string }[];

    const reduxProduct = cartState.find((item) => item.productId === id);

    if (reduxProduct) {
      setIsProductAddedToCart(true);
      setProductQuantity(reduxProduct.quantity);
      return;
    }

    const localProduct = authCart.find((item) => item.id === id);
    const wishlistProduct = authWishlist.find((item) => item.id === id);
    const localCartProduct = localStorageCart.find(
      (item) => item.productId === id
    );
    const localWishlistProduct = localwishlist.find(
      (item) => item.productId === id
    );

    if (localWishlistProduct) {
      setIsProductAddedToWishlist(true);
    } else if (wishlistProduct) {
      setIsProductAddedToWishlist(true);
    } else {
      setIsProductAddedToWishlist(false);
    }

    if (localCartProduct) {
      setIsProductAddedToCart(true);
      setProductQuantity(localCartProduct.quantity);
      return;
    }

    if (localProduct) {
      setIsProductAddedToCart(true);
      setProductQuantity(localProduct.quantity);
    } else {
      setIsProductAddedToCart(false);
      setProductQuantity(1);
    }
  }, [cartState, id, isLogin]);

  useEffect(() => {
    console.log("user login cart page", isLogin);
    if (authChecked && !isLogin) {
      toast.error("You are not login!", "Kindly sign in to get a deal.");
    }
  }, [authChecked, isLogin, toast]);

  useEffect(() => {
    if (totalStock < 10) {
      toast.error(
        "🛒 Low Stock Alert",
        `Act fast! Only ${totalStock} units remaining.`
      );
    }
  }, [toast, totalStock]);

  const addToCartToast = (productName: string) => {
    toast.success(
      `${productName} added to cart 🛒`,
      "Product added! Check your cart to proceed.",
      5000
    );
  };

  const removeToCartToast = (productName: string) => {
    toast.error(
      `${productName} removed from cart 🛒`,
      "Removed! You can always add it back later.",
      5000
    );
  };

  const addToWishlistToast = (productName: string) => {
    toast.success(
      `${productName} Saved for later`,
      "Product added to your wishlist ❤️",
      5000
    );
  };

  const removeToWishlistToast = (productName: string) => {
    toast.error(
      `${productName} No longer on your wishlist.`,
      "Removed 💔 Want it back? Just add it again.",
      5000
    );
  };
  const productRemoveMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: (response) => {
      console.log("productRemoveMutation response--", response);
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      
      toast.success("Product is remove", "Product is remove from the cart.");
    },
  });
  const addProductMutation = useMutation({
    mutationFn: multilpeProductAddToCart,
    onSuccess: (response) => {
      const { isAccessTokenExp } = response.data;
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

      // TODO: DELTE localstorage key for cart both login and logout
      localStorage.removeItem("loginUserCart");
      localStorage.removeItem("logoutUserCart");
    },
  });

  const handleAddToCart = () => {
    const localStorageKey = isLogin ? "loginUserCart" : "logoutUserCart";
    let cartData: CartProducts[] = [];
    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as {
      id: string;
      quantity: number;
    }[];
    cartData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");

    if (isProductAddedToCart) {
      // remove from redux store
      dispatch(removeCartProduct({ productId: id }));
      removeToCartToast(title);
      // Remove from localStorage
      const updatedCart = cartData.filter((product) => product.id !== id);
      const updatedCartProduct = cart.filter((product) => product.id !== id);

      localStorage.setItem(localStorageKey, JSON.stringify(updatedCart));

      localStorage.setItem("cart", JSON.stringify(updatedCartProduct));

      // TODO: if logoin remove mutation call for remove item in cart
      if (isLogin ) {
        productRemoveMutation.mutate({productId:id})
      }
    } else {
      // add to redux store
      dispatch(
        // addCart({ brand, imageUrl, price, productId: id, quantity: 1, title,currency })
        addCart({ productId: id, quantity: 1 })
      );

      addToCartToast(title);
      // if product already exists
      const existingProduct = cartData.find((product) => product.id === id);
      const existingCartProduct = cart.find((product) => product.id === id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cartData.push({ id, quantity: 1 });
      }
      if (existingCartProduct) {
        existingCartProduct.quantity += 1;
      } else {
        cart.push({ id, quantity: 1 });
      }
      //  updated cart
      localStorage.setItem(localStorageKey, JSON.stringify(cartData));
      localStorage.setItem("cart", JSON.stringify(cart));
      // TODO : call dispatch call for multilpeProductAddToCart with sync localstorage if login and  DELeTE localstorage key for cart both login and logout
      if(isLogin && cart.length>0){
        addProductMutation.mutate(cart)
      }
    }
    // Toggle UI state
    setIsProductAddedToCart(!isProductAddedToCart);
  };
  const handleAddToWishlist = () => {
    const localStorageKey = isLogin
      ? "loginUserWishlist"
      : "logoutUserWishlist";
    let wishlistData: WishListProducts[] = [];
    try {
      wishlistData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
    } catch (error) {
      console.error("Failed to parse local storage wishlist data:", error);
    }
    if (isProductAddedToWishlist) {
      // remove from redux store
      dispatch(removeProductFromWishlist({ productId: id }));
      removeToWishlistToast(title);
      const updatedWishlist = wishlistData.filter(
        (product) => product.id !== id
      );
      localStorage.setItem(localStorageKey, JSON.stringify(updatedWishlist));
    } else {
      // add to redux store
      dispatch(
        addProductToWishList({
          brand,
          imageUrl,
          price,
          productId: id,
          quantity: 1,
          title,
        })
      );
      addToWishlistToast(title);
      wishlistData.push({ id: id });
      localStorage.setItem(localStorageKey, JSON.stringify(wishlistData));
    }
    setIsProductAddedToWishlist(!isProductAddedToWishlist);
  };
  // const handleAddToWishlist = () => {

  //   if (isProductAddedToWishlist) {
  //     dispatch(removeProductFromWishlist({ productId: id }));
  //     removeToWishlistToast(title);
  //   } else {
  //     dispatch(
  //       addProductToWishList({
  //         brand,
  //         imageUrl,
  //         price,
  //         productId: id,
  //         quantity: 1,
  //         title,
  //       })
  //     );
  //     addToWishlistToast(title);
  //   }
  //   setIsProductAddedToWishlist(!isProductAddedToWishlist);
  // };

  // const handleAddQuantity = () => {
  //   if (productQuantity + 1 <= totalStock) {
  //     addCart({
  //       brand,
  //       imageUrl,
  //       price,
  //       productId: id,
  //       quantity: productQuantity + 1,
  //       title,
  //     });
  //     setProductQuantity((prev) => prev + 1);
  //     if (isLogin) {
  //       const cartData = JSON.parse(
  //         localStorage.getItem("loginUserCart") || "[]"
  //       );
  //       const existingProduct: { id: string; quantity: number } =
  //         cartData.filter((product: CartProducts) => product.id === id);
  //       if (existingProduct) {
  //         existingProduct.quantity += 1;
  //         const cartProducts: CartProducts[] = cartData.filter(
  //           (product: CartProducts) => product.id !== id
  //         );
  //         cartProducts.push(existingProduct);
  //         localStorage.removeItem("loginUserCart");
  //         localStorage.setItem("loginUserCart", JSON.stringify(cartProducts));
  //       } else {
  //         cartData.push({ id: id, quantity: 1 });
  //       }
  //     } else {
  //       const cartData = JSON.parse(
  //         localStorage.getItem("logoutUserCart") || "[]"
  //       );
  //       const existingProduct: { id: string; quantity: number } =
  //         cartData.filter((product: CartProducts) => product.id === id);
  //       if (existingProduct) {
  //         existingProduct.quantity += 1;
  //         const cartProducts: CartProducts[] = cartData.filter(
  //           (product: CartProducts) => product.id !== id
  //         );
  //         cartProducts.push(existingProduct);
  //         localStorage.removeItem("logoutUserCart");
  //         localStorage.setItem("logoutUserCart", JSON.stringify(cartProducts));
  //       } else {
  //         cartData.push({ id: id, quantity: 1 });
  //       }
  //     }
  //   } else {
  //     toast.error(
  //       "Stock running low",
  //       "Kindly decrease product quanty.Or try it later!"
  //     );
  //   }
  // };

  const handleAddQuantity = () => {
    if (productQuantity + 1 > totalStock) {
      toast.error(
        "Stock running low",
        "Kindly decrease product quantity. Or try it later!"
      );
      return;
    }
    setProductQuantity((prev) => prev + 1);
    const localStorageKey = isLogin ? "loginUserCart" : "logoutUserCart";
    dispatch(
      addCart({
        // brand,
        // imageUrl,
        // price,
        productId: id,
        quantity: productQuantity + 1,
        // title,
        // currency,
      })
    );
    try {
      const cartData: CartProducts[] = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );
      const existingProduct = cartData.find((product) => product.id === id);
      const cart = JSON.parse(localStorage.getItem("cart") || "[]") as {
        id: string;
        quantity: number;
      }[];
      const existingCartProduct = cart.find((product) => product.id === id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cartData.push({ id, quantity: 1 });
      }
      if (existingCartProduct) {
        existingCartProduct.quantity += 1;
      } else {
        cart.push({ id, quantity: 1 });
      }

      localStorage.setItem(localStorageKey, JSON.stringify(cartData));
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // const handleRemoveQuantity = () => {
  //   if (productQuantity - 1 === 0) {
  //     dispatch(removeCartProduct({ productId: id }));
  //     setIsProductAddedToCart(false);
  //     setProductQuantity(0);
  //     if (isLogin) {
  //       const cartData = JSON.parse(
  //         localStorage.getItem("loginUserCart") || "[]"
  //       );
  //       const newProducts: { id: string; quantity: number } = cartData.filter(
  //         (product: CartProducts) => product.id !== id
  //       );
  //       localStorage.removeItem("loginUserCart");
  //       localStorage.setItem("loginUserCart", JSON.stringify(newProducts));
  //     } else {
  //       const cartData = JSON.parse(
  //         localStorage.getItem("logoutUserCart") || "[]"
  //       );
  //       const newProducts: { id: string; quantity: number } = cartData.filter(
  //         (product: CartProducts) => product.id !== id
  //       );
  //       localStorage.removeItem("logoutUserCart");
  //       localStorage.setItem("logoutUserCart", JSON.stringify(newProducts));
  //     }
  //     removeToCartToast(title);
  //   } else {
  //     setProductQuantity((prev) => prev - 1);
  //     if (isLogin) {
  //       const cartData = JSON.parse(
  //         localStorage.getItem("loginUserCart") || "[]"
  //       );
  //       const existingProduct: { id: string; quantity: number } =
  //         cartData.filter((product: CartProducts) => product.id === id);
  //       if (existingProduct) {
  //         existingProduct.quantity -= 1;
  //         const cartProducts: CartProducts[] = cartData.filter(
  //           (product: CartProducts) => product.id !== id
  //         );
  //         cartProducts.push(existingProduct);
  //         localStorage.removeItem("loginUserCart");
  //         localStorage.setItem("loginUserCart", JSON.stringify(cartProducts));
  //       }
  //     } else {
  //       const cartData = JSON.parse(
  //         localStorage.getItem("logoutUserCart") || "[]"
  //       );
  //       const existingProduct: { id: string; quantity: number } =
  //         cartData.filter((product: CartProducts) => product.id === id);
  //       if (existingProduct) {
  //         existingProduct.quantity -= 1;
  //         const cartProducts: CartProducts[] = cartData.filter(
  //           (product: CartProducts) => product.id !== id
  //         );
  //         cartProducts.push(existingProduct);
  //         localStorage.removeItem("logoutUserCart");
  //         localStorage.setItem("logoutUserCart", JSON.stringify(cartProducts));
  //       }
  //     }
  //   }
  // };
  const handleRemoveQuantity = () => {
    const localStorageKey = isLogin ? "loginUserCart" : "logoutUserCart";
    if (productQuantity - 1 <= 0) {
      dispatch(removeCartProduct({ productId: id }));
      setIsProductAddedToCart(false);
      setProductQuantity(0);
      removeToCartToast(title);
      try {
        const cartData: CartProducts[] = JSON.parse(
          localStorage.getItem(localStorageKey) || "[]"
        );
        const cart = JSON.parse(localStorage.getItem("cart") || "[]") as {
          id: string;
          quantity: number;
        }[];
        const updatedCart = cartData.filter((product) => product.id !== id);
        const newUpdatedCart = cart.filter((product) => product.id !== id);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedCart));
        localStorage.setItem("cart", JSON.stringify(newUpdatedCart));
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
      return;
    }
    setProductQuantity((prev) => prev - 1);
    try {
      const cartData: CartProducts[] = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );
      const cart = JSON.parse(localStorage.getItem("cart") || "[]") as {
        id: string;
        quantity: number;
      }[];
      const existingProductInCart = cart.find((product) => product.id === id);
      const existingProduct = cartData.find((product) => product.id === id);
      if (existingProduct) {
        existingProduct.quantity -= 1;
        // TODO :CHECK
        localStorage.setItem(localStorageKey, JSON.stringify(cartData));
      }
      if (existingProductInCart) {
        existingProductInCart.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center  gap-4 md:gap-10 pt-4 mb-6 mt-6">
        {totalStock > 0 && (
          <div className="order-1">
            {/* // TODO : NO CART BTN DISPLAY AT TOTAL STOCK === 0 */}
            {isProductAddedToCart ? (
              <div className="flex order-2 items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button variant={"outline"} onClick={handleRemoveQuantity}>
                    <Minus />
                  </Button>
                  <div>{productQuantity}</div>
                  <Button variant={"outline"} onClick={handleAddQuantity}>
                    <Plus />
                  </Button>
                </div>

                <div>
                  <Button
                    variant={"ghost"}
                    onClick={handleAddToCart}
                    className=" hover:bg-red-100 text-red-500"
                  >
                    <Trash2 className="text-red-500" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex px-2.5 py-1.5 bg-blue-500 rounded-md hover:bg-blue-700 text-white gap-2"
              >
                <ShoppingCart />
                Add To Cart
              </button>
            )}
          </div>
        )}
        <div className="order-0">
          {isProductAddedToWishlist ? (
            <div>
              <Button
                variant={"ghost"}
                onClick={handleAddToWishlist}
                className=" hover:bg-red-100 text-red-500"
              >
                <Heart className="text-red-500 fill-red-500" />
              </Button>
            </div>
          ) : (
            <div>
              <button
                onClick={handleAddToWishlist}
                className="flex px-2.5 py-1.5 bg-stone-500 rounded-md hover:bg-stone-600 text-white gap-2"
              >
                <Heart />
                Add To Favorites
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBtn;
