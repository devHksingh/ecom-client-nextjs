"use client";
import useToast from "@/hook/useToast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addCart,
  removeCartProduct,
} from "@/lib/store/features/cart/cartSlice";
import {
  Heart,
  LoaderCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  addProductToWishList,
  removeProductFromWishlist,
} from "@/lib/store/features/wishlist/wishlistSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, addToWishlist, removeFromCart, updateCartQuantity } from "@/http/api";
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
    if (totalStock < 5) {
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
      // TODO: REMOVE PRODUCT FROM LOCAL STORAGE
      const localStorageKey = isLogin
        ? "loginUserWishlist"
        : "logoutUserWishlist";
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

      toast.success("Product is remove", "Product is remove from the cart.");
    },
    onError: () => {
      const localStorageKey = isLogin
        ? "loginUserWishlist"
        : "logoutUserWishlist";
      const cartData: CartProducts[] = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );
      const cart = JSON.parse(localStorage.getItem("cart") || "[]") as {
        id: string;
        quantity: number;
      }[];
      cartData.push({ id, quantity: 1 });
      cart.push({ id, quantity: 1 });
      setProductQuantity(1);
      setIsProductAddedToCart(true);
      toast.error("Unable to remove product", "Kindly retry for it!");
    },
  });
  const addProductMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (response) => {
      const { isAccessTokenExp } = response.data;
      if (isAccessTokenExp) {
        //  token in localStorge and redux state
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
    },
  });

  const productQuantityMutation = useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: (response) => {
      const { isAccessTokenExp, message } = response.data;
      if (message === "Product quantity increased successfully") {
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
        setProductQuantity((prev) => prev + 1);
      }
      if (message === "Product remove from cart successfully'") {
        setProductQuantity((prev) => prev - 1);
      }
      if (isAccessTokenExp) {
        //  Update token in localStorge and redux state
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
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn:addToWishlist,
    onSuccess:(response)=>{
      const { isAccessTokenExp } = response.data;
      if (isAccessTokenExp) {
        //  token in localStorge and redux state
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
        setIsProductAddedToWishlist(true)
      }
    },
    onError:()=>{
      setIsProductAddedToWishlist(false)
      dispatch(removeProductFromWishlist({ productId: id }));
      const localStorageKey = isLogin
      ? "loginUserWishlist"
      : "logoutUserWishlist";
      let wishlistData: WishListProducts[] = [];
      wishlistData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
      const updatedWishlist = wishlistData.filter(
        (product) => product.id !== id
      );
      localStorage.setItem(localStorageKey, JSON.stringify(updatedWishlist));
      toast.error("Request Falied","Failed to add product on wishlist .Kindly retry!")
    }
  })

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
      if (isLogin) {
        productRemoveMutation.mutate({ productId: id });
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
      if (isLogin && cart.length > 0) {
        addProductMutation.mutate({ productId: id, quantity: 1 });
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
      if(isLogin){
        addToWishlistMutation.mutate({productId:id})
      }
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
    const currentQuantity = productQuantity;
    console.log("currentQuantity", currentQuantity);

    const localStorageKey = isLogin ? "loginUserCart" : "logoutUserCart";
    // TODO: CALL api to add cart quantity if login
    if (isLogin) {
      productQuantityMutation.mutate({
        productId: id,
        quantity: currentQuantity + 1,
        type: "add",
      });
    }

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

    //  If quantity already 0, do nothing
    if (productQuantity === 0) {
      console.log("Already at zero, nothing to remove.");
      return;
    }

    //  If quantity becomes 0 after decrease, remove product fully
    if (productQuantity - 1 === 0) {
      dispatch(removeCartProduct({ productId: id }));
      setIsProductAddedToCart(false);
      setProductQuantity(0);

      if (isLogin) {
        productRemoveMutation.mutate({ productId: id });
      }

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
      return;
    }

    setProductQuantity((prev) => prev - 1);

    productQuantityMutation.mutate({
      productId: id,
      quantity: 1,
      type: "remove",
    });

    try {
      const cartData: CartProducts[] = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );
      const cart = JSON.parse(localStorage.getItem("cart") || "[]") as {
        id: string;
        quantity: number;
      }[];

      const existingProduct = cartData.find((product) => product.id === id);
      const existingProductInCart = cart.find((product) => product.id === id);

      if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
      }
      if (existingProductInCart && existingProductInCart.quantity > 1) {
        existingProductInCart.quantity -= 1;
      }

      localStorage.setItem(localStorageKey, JSON.stringify(cartData));
      localStorage.setItem("cart", JSON.stringify(cart));
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
                    disabled={productRemoveMutation.isPending}
                  >
                    {productRemoveMutation.isPending ? (
                      <LoaderCircle className="animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={addProductMutation.isPending}
                className="flex px-2.5 py-1.5 bg-blue-500 rounded-md hover:bg-blue-700 text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addProductMutation.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    <ShoppingCart />
                    Add To Cart
                  </>
                )}
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
