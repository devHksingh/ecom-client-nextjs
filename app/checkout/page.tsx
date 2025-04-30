"use client";

import { getStatusmultipleProduct, getUser } from "@/http/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateAccessToken } from "@/lib/store/features/user/authSlice";
import { ProductProps } from "@/types/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartItemsPostReqProps } from "../cart/page";
import { addInfo } from "@/lib/store/features/user/userSlice";

interface UserCartData {
  productId: string;
  quantity: number;
}
interface apiCartProduct {
  product: ProductProps;
  quantity: number;
}
interface invalidProductsProps {
  product?: ProductProps;
  quantity: number;
  reason: string;
}

export default function CheckOutPage() {
  const [validProducts, setValidProducts] = useState<apiCartProduct[] | []>([]);
  const [invalidProducts, setInvalidProducts] = useState<
    invalidProductsProps[] | []
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPriceInDollar, setTotalPriceInDollar] = useState(0);
  const [userCartData, setUserCartData] = useState<UserCartData[]>([]);
  const [userState, setUserState] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPincode, setUserPincode] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userReduxState = useAppSelector((state) => state.user);
  const userAuthReduxState = useAppSelector((state) => state.auth);

  // if redux store have user info
  useEffect(() => {
    if (userReduxState.address && userAuthReduxState.userName) {
      setUserAddress(userReduxState.address);
      setUserPincode(userReduxState.pincode);
      setUserName(userAuthReduxState.userName);
      setUserEmail(userAuthReduxState.useremail);
    }
  }, [
    userAuthReduxState.userName,
    userAuthReduxState.useremail,
    userReduxState.address,
    userReduxState.pincode,
  ]);

  // get user details if redux state empty
  const { data: UserInfoData } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUser,
    staleTime: 40 * 60 * 1000,
    refetchInterval: 41 * 60 * 1000,
    refetchIntervalInBackground: true,
    enabled: !userReduxState.address,
  });

  useEffect(() => {
    if (UserInfoData) {
      console.log("UserInfoData", UserInfoData);
      const { user, isAccessTokenExp } = UserInfoData.data;
      if (isAccessTokenExp) {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const { accessToken: newAccessToken } = UserInfoData.data;
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
      const { address, pinCode, email, name, phoneNumber } = user;
      dispatch(addInfo({ address, phoneNumber, pincode: pinCode }));
      setUserEmail(email);
      setUserName(name);
      setUserAddress(address);
      setUserPincode(pinCode);
    }
  }, [UserInfoData]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart || cart.length === 0) {
      router.replace("/");
    } else {
      setUserCartData(cart);
    }
  }, [router]);
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

    if (!storedUser || !storedUser.accessToken) {
      router.replace("/login");
    } else {
      setUserState(storedUser);
    }
  }, [router]);

  // api call
  const mutation = useMutation({
    mutationFn: getStatusmultipleProduct,
    onSuccess: (response) => {
      const {
        isAccessTokenExp,
        totalItems,
        totalPriceInDollar,
        validProducts,
        invalidProducts,
      } = response.data;
      console.log("response.data", response.data);
      console.log("response", response);

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
      // const { items, totalAmount, totalItems } = cart;
      const cartVaildProducts: CartItemsPostReqProps[] = [];
      if (validProducts.length > 0) {
        validProducts.map((item: CartItemsPostReqProps) => {
          const product = item.product;
          const quantity = item.quantity;
          cartVaildProducts.push({ product, quantity });
        });
      }
      const cartInValidProducts: invalidProductsProps[] = [];
      if (invalidProducts.length > 0) {
        invalidProducts.map((item: invalidProductsProps) => {
          const product = item.product;
          const quantity = item.quantity;
          const reason = item.reason;
          cartInValidProducts.push({ product, quantity, reason });
        });
      }
      setInvalidProducts(cartInValidProducts);
      setValidProducts(cartVaildProducts);
      setTotalPrice(totalPriceInDollar);
      setTotalQuantity(totalItems);
      console.log("cartProducts-----", cartVaildProducts);
    },
  });
  useEffect(() => {
    if (userState && userCartData.length > 0) {
      mutation.mutate(userCartData);
    }
  }, [userState, userCartData]);

  if (mutation.isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Skeleton */}
          <div className="flex justify-center items-center bg-white p-6 rounded-lg">
            <div className="relative h-72 w-72 md:h-96 md:w-96 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          {/* Product Details Skeleton */}
          <div className="flex flex-col space-y-4">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="pt-4 flex">
              <div className="h-12 w-36 bg-gray-200 animate-pulse rounded-lg mr-4"></div>
              <div className="h-12 w-36 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (mutation.isError) {
    return (
      <div className="container">
        <div className="mt-8 text-red-500 text-lg text-center p-2">
          <p>
            We are facing an error while loading your checkoutPage.Try it again!
          </p>
        </div>
      </div>
    );
  }

  return <div></div>;
}

/*
    0.check user is login => not => redirect to login page
    1 get cart data from local storage and hit getStatusmultipleProduct
    2.valid api respose
    3.get user data from session storage 
    4. validate user address 
    */
// const { data, isError, isLoading } = useQuery({
//   queryKey: ["checkoutPage"],
//   queryFn: () => getStatusmultipleProduct(userCartData),
//   enabled: userCartData.length > 0,
// });
// useEffect(() => {
//   if (data) {
//     const {
//       isAccessTokenExp,
//       validProducts,
//       invalidProducts,
//       totalItems,
//       totalPriceInDollar,
//     } = data.data;
// if (isAccessTokenExp) {
//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const { accessToken: newAccessToken } = data.data;
//   dispatch(updateAccessToken({ accessToken: newAccessToken }));
//   const { email, id, name, refreshToken } = user;
//   const updatedUserData = {
//     accessToken: newAccessToken,
//     email,
//     id,
//     name,
//     refreshToken,
//   };
//   sessionStorage.removeItem("user");
//   sessionStorage.setItem("user", JSON.stringify(updatedUserData));
// }
//     setValidProducts(validProducts);
//     setInvalidProducts(invalidProducts);
//     setTotalItems(totalItems);
//     setTotalPriceInDollar(totalPriceInDollar);
//   }
// }, [data, dispatch]);
