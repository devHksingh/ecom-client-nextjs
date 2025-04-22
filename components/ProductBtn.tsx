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

const ProductBtn = ({
  id,
  brand,
  title,
  imageUrl,
  totalStock,
  price,
}: ProductBtnProps) => {
  const [isProductAddedToCart, setIsProductAddedToCart] = useState(false);
  const [isProductAddedToWishlist, setIsProductAddedToWishlist] =
    useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const userState = useAppSelector((state) => state.auth);
//   const cartState = useAppSelector((state) => state.cart);
//   const wishListState = useAppSelector((state) => state.wishList);
  const dispatch = useAppDispatch();

  const toast = useToast();

  const { isLogin } = userState;

  useEffect(() => {
    if (!isLogin) {
      toast.error("You are not login!", "Kindly sign in to get a deal. ");
    }
  }, [isLogin, toast]);

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

  const handleAddToCart = () => {
    if (isProductAddedToCart) {
      dispatch(removeCartProduct({ productId: id }));
      removeToCartToast(title);
    } else {
      dispatch(
        addCart({ brand, imageUrl, price, productId: id, quantity: 1, title })
      );
      addToCartToast(title);
    }
    setIsProductAddedToCart(!isProductAddedToCart);
  };

  const handleAddToWishlist = () => {
    if (isProductAddedToWishlist) {
      dispatch(removeProductFromWishlist({ productId: id }));
      removeToWishlistToast(title);
    } else {
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
    }
    setIsProductAddedToWishlist(!isProductAddedToWishlist);
  };

  const handleAddQuantity = () => {
    if (productQuantity + 1 <= totalStock) {
      addCart({
        brand,
        imageUrl,
        price,
        productId: id,
        quantity: productQuantity + 1,
        title,
      });
      setProductQuantity((prev) => prev + 1);
    } else {
      toast.error(
        "Stock running low",
        "Kindly decrease product quanty.Or try it later!"
      );
    }
  };

  const handleRemoveQuantity = () => {
    if (productQuantity - 1 === 0) {
      dispatch(removeCartProduct({ productId: id }));
      setIsProductAddedToCart(false);
      setProductQuantity(0);
      removeToCartToast(title);
    } else {
      setProductQuantity((prev) => prev - 1);
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

//   const handleAddToWishlist = () => {
//     setIsProductAddedToWishlist(!isProductAddedToWishlist);
//     if (!isProductAddedToWishlist) {
//       dispatch(removeCartProduct({ productId: id }));
//       removeToCartToast(title);
//     } else {
//       dispatch(
//         addCart({ brand, imageUrl, price, productId: id, quantity: 1, title })
//       );
//       addToCartToast(title);
//     }
//   };

//   const handleAddToCart = () => {
//     setIsProductAddedToCart(!isProductAddedToCart);
//     if (!isProductAddedToCart) {
//       dispatch(removeCartProduct({ productId: id }));
//       removeToCartToast(title);
//     } else {
//       dispatch(
//         addCart({ brand, imageUrl, price, productId: id, quantity: 1, title })
//       );
//       addToCartToast(title);
//     }
//   };
