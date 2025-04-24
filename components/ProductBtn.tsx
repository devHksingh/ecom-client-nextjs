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

interface ProductBtnProps {
  id: string;
  brand: string;
  title: string;
  imageUrl: string;
  totalStock: number;
  price: number;
}
interface CartProducts {
  id: string;
  quantity: number;
}
interface WishListProducts{
  id:string;
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

  const dispatch = useAppDispatch();

  const toast = useToast();

  const { isLogin } = userState;
  // Delaying toast until login status is determined
    useEffect(() => {
      if (typeof isLogin === "boolean") {
        setAuthChecked(true);
      }
    }, [isLogin]);

  // useEffect(() => {
  //   if (!isLogin) {
  //     toast.error("You are not login!", "Kindly sign in to get a deal. ");
  //   }
  // }, [isLogin, toast]);
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

  // const handleAddToCart = () => {
  //   if (isProductAddedToCart) {
  //     dispatch(removeCartProduct({ productId: id }));
  //     // removeToCartToast(title);
  //     // remove product from cart
  //     if (isLogin) {
  //       // avoid breaking  app if the stored data is invalid
  //       try {
  //         const cartData = JSON.parse(
  //           localStorage.getItem("loginUserCart") || "[]"
  //         );
  //         console.log("cart login data", cartData);
  //         if (cartData.length > 0) {
  //           const newCart: [] = cartData.filter(
  //             (product: CartProducts) => product.id !== id
  //           );
  //           localStorage.removeItem("loginUserCart");
  //           localStorage.setItem("loginUserCart", JSON.stringify(newCart));
  //         }
  //       } catch (error) {
  //         console.error("Failed to parse cart:", error);
  //       }
  //     } else {
  //       try {
  //         const cartData = JSON.parse(
  //           localStorage.getItem("logoutUserCart") || "[]"
  //         );
  //         if (cartData.length > 0) {
  //           const newCart: [] = cartData.filter(
  //             (product: CartProducts) => product.id !== id
  //           );
  //           localStorage.removeItem("logoutUserCart");
  //           localStorage.setItem("logoutUserCart", JSON.stringify(newCart));
  //         }
  //       } catch (error) {
  //         console.error("Failed to parse cart:", error);
  //       }
  //     }
  //     removeToCartToast(title);
  //   } else {
  //     // add cart product
  //     dispatch(
  //       addCart({ brand, imageUrl, price, productId: id, quantity: 1, title })
  //     );
  //     // login || withoutLogin
  //     if (isLogin) {
  //       try {
  //         const cartData = JSON.parse(
  //           localStorage.getItem("loginUserCart") || "[]"
  //         );
  //         if (cartData.length > 0) {
  //           const existingProduct: { id: string; quantity: number } =
  //             cartData.filter((product: CartProducts) => product.id === id);
  //           if (existingProduct) {
  //             existingProduct.quantity += 1;
  //             const cartProducts: CartProducts[] = cartData.filter(
  //               (product: CartProducts) => product.id !== id
  //             );
  //             cartProducts.push(existingProduct);
  //             localStorage.removeItem("loginUserCart");
  //             localStorage.setItem(
  //               "loginUserCart",
  //               JSON.stringify(cartProducts)
  //             );
  //           } else {
  //             cartData.push({ id: id, quantity: 1 });
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Failed to parse cart:", error);
  //       }
  //     }
  //     addToCartToast(title);
  //   }
  //   setIsProductAddedToCart(!isProductAddedToCart);
  // };

  const handleAddToCart = () => {
    const localStorageKey = isLogin ? "loginUserCart" : "logoutUserCart";
    let cartData: CartProducts[] = [];
    try {
      cartData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
    } catch (error) {
      console.error("Failed to parse local storage cart data:", error);
    }
    if (isProductAddedToCart) {
      // remove from redux store
      dispatch(removeCartProduct({ productId: id }));
      removeToCartToast(title);
      // Remove from localStorage
      const updatedCart = cartData.filter((product) => product.id !== id);
      localStorage.setItem(localStorageKey, JSON.stringify(updatedCart));
    } else {
      // add to redux store
      dispatch(
        addCart({ brand, imageUrl, price, productId: id, quantity: 1, title })
      );
      addToCartToast(title);
      // if product already exists
      const existingProduct = cartData.find((product) => product.id === id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cartData.push({ id, quantity: 1 });
      }
      //  updated cart
      localStorage.setItem(localStorageKey, JSON.stringify(cartData));
    }
    // Toggle UI state
    setIsProductAddedToCart(!isProductAddedToCart);
  };
  const handleAddToWishlist = () => {
    const localStorageKey = isLogin ? "loginUserWishlist" : "logoutUserWishlist";
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
      const updatedWishlist = wishlistData.filter((product)=>product.id !== id)
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
      wishlistData.push({id:id})
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

  const handleAddQuantity =()=>{
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
        brand,
        imageUrl,
        price,
        productId: id,
        quantity: productQuantity + 1,
        title,
      })
    );
    try {
      const cartData: CartProducts[] = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );
      const existingProduct = cartData.find((product) => product.id === id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cartData.push({ id, quantity: 1 });
      }

      localStorage.setItem(localStorageKey, JSON.stringify(cartData));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

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
    if(productQuantity -1 <=0){
      dispatch(removeCartProduct({ productId: id }));
      setIsProductAddedToCart(false);
      setProductQuantity(0);
      removeToCartToast(title);
      try {
        const cartData: CartProducts[] = JSON.parse(
          localStorage.getItem(localStorageKey) || "[]"
        );
        const updatedCart = cartData.filter((product) => product.id !== id);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
      return
    }
    setProductQuantity((prev) => prev - 1);
    try {
      const cartData: CartProducts[] = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );
      const existingProduct = cartData.find((product) => product.id === id);
      if(existingProduct){
        existingProduct.quantity -= 1;
        // TODO :CHECK
        localStorage.setItem(localStorageKey, JSON.stringify(cartData));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }

  }

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

/*
const loginUserCartItems = [];
  const withOutLoginUserCartItems = [];
  const loginUserWishlist = [];
  const withoutLoginUserWishlist = [];
  // const logincartData = JSON.parse(localStorage.getItem("loginUserCart") || "[]");
  //   const cartState = useAppSelector((state) => state.cart);
  //   const wishListState = useAppSelector((state) => state.wishList);
*/
