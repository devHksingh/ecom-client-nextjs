"use client";



import ListWishlistProduct from "@/components/ListWishlistProduct";
import { forcedLogout, getWishlist } from "@/http/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  deleteUser,
  updateAccessToken,
} from "@/lib/store/features/user/authSlice";
import { ProductProps } from "@/types/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface ErrorResponse {
  message: string;
}

const WishlistPage = () => {
  const [wishListData, setWishListData] = useState<ProductProps[] | []>([]);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const router = useRouter();
  const wishListReduxState = useAppSelector((state) => state.wishList);
  const userReduxState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  //   redirect user if not login

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

    if (!storedUser || !storedUser.accessToken) {
      router.replace("/login");
    } else {
      setIsUserLogin(true);
    }
  }, [router]);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: isUserLogin,
  });

  // Invalid or expired refresh token
  const logoutMutation = useMutation({
    mutationKey: ["logoutUser"],
    mutationFn: forcedLogout,
    onSuccess: () => {
      dispatch(deleteUser());
      sessionStorage.removeItem("user");
      router.replace("/");
    },
  });

  useEffect(() => {
    if (data) {
      console.log("wishlist", data.data);
      const { wishlist, isAccessTokenExp } = data.data;
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
      const { products } = wishlist;
      setWishListData(products);
    }
  }, [data]);

  if (isLoading) {
    // toast.info("Fetching cart data", "Please wait we fecthig cart data ");
    return (
      <div className=" container">
        <div className="flex justify-between items-center h-full">
          <span>
            <LoaderCircle
              strokeWidth={2}
              className="w-12 h-12 text-indigo-600 animate-spin"
            />
          </span>
        </div>
      </div>
    );
  }
  if (isError) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const errorMessage =
      axiosError.response?.data?.message ||
      "Something went wrong. Failed to fetch wishlist data. Please try again later.Or refresh the page";
    if (axiosError.status === 401) {
      logoutMutation.mutate();
    }
    return (
      <div className=" container">
        <div className="flex justify-center items-center h-full text-red-500 text-lg">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {data && (
        <div className=" container">
        {wishListData.length > 0 && (
          <ListWishlistProduct products={wishListData}/>
        )}
  
        {wishListReduxState.length === 0 && wishListData.length === 0 && (
          <div className="mt-16">
            <div className="text-center text-2xl text-red-500">
              No Product in wishList
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default WishlistPage;
