"use client";

import {
  getStatusmultipleProduct,
  getUser,
  placeMultipleOrder,
  removeFromCart,
  updateAddress,
} from "@/http/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateAccessToken } from "@/lib/store/features/user/authSlice";
import { ProductProps } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartItemsPostReqProps } from "../cart/page";
import { addInfo } from "@/lib/store/features/user/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { CheckCircle, CreditCard, LoaderCircle, Truck } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import useToast from "@/hook/useToast";

interface UserCartData {
  productId: string;
  quantity: number;
}
interface apiCartProduct {
  product: ProductProps;
  quantity: number;
}
interface invalidProductsProps {
  product: ProductProps;
  quantity: number;
  reason: string;
}

interface FormFields {
  address: string;
  pinCode: string;
  phoneNumber: string;
}

interface ErrorResponse {
  message: string;
}

interface InvalidProductsProps {
  product: ProductProps;
  quantity: number;
  reason: string;
}

interface OrderProps {
  trackingId: string;
  orderId: string;
  orderStatus: string;
  orderPlaceOn: string;
  userName: string;
  userAddress: string;
  userPhoneNumber: string;
  userPinCode: string;
  userEmail: string;
  productDetails: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string[];
    discountPrice: number;
    currency: string;
  };
  quantity: number;
  totalPrice: number;
}

const formSchema = z.object({
  address: z
    .string()
    .trim()
    .min(4, "Enter valid address with 4 character is long"),
  pinCode: z
    .string()
    .trim()
    .min(6, "Enter vaild pincode .Pincode must be 6 character is long"),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "phoneNumber must be 10 digit")
    .max(10, "phoneNumber must be 10 digit"),
});

export default function CheckOutPage() {
  const [validProducts, setValidProducts] = useState<apiCartProduct[] | []>([]);
  // const [invalidProducts, setInvalidProducts] = useState<
  //   invalidProductsProps[] | []
  // >([]);
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
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [updateAddressErrMsg, setUpdateAddressErrMsg] = useState("");
  const [removeProductId, setRemoveProductId] = useState("");
  const [isValidUserInfo, setIsValidUserInfo] = useState(false);
  const [isUserValidAddress, setIsUserValidAddress] = useState(false);
  const [isOrderPalced, setIsOrderPalced] = useState(false);
  const [invalidProducts, setInvalidProducts] = useState<
    InvalidProductsProps[] | []
  >([]);
  const [orderPlacedResponse, setOrderPlacedResponse] = useState<
    OrderProps[] | []
  >([]);
  const [placeOrderError, setPlaceOrderError] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();
  const userReduxState = useAppSelector((state) => state.user);
  const userAuthReduxState = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const toast = useToast();

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

  // if redux store have user info
  useEffect(() => {
    if (userReduxState.address && userAuthReduxState.userName) {
      setUserAddress(userReduxState.address);
      setUserPincode(userReduxState.pincode);
      setUserName(userAuthReduxState.userName);
      setUserEmail(userAuthReduxState.useremail);
      setUserPhoneNumber(userReduxState.phoneNumber);
    }
  }, [
    userAuthReduxState.userName,
    userAuthReduxState.useremail,
    userReduxState.address,
    userReduxState.phoneNumber,
    userReduxState.pincode,
  ]);

  // get user details if redux state empty
  const { data: UserInfoData } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUser,
    enabled: !userReduxState.address,
  });

  // TODO: REMOVE IN PRODUCTION ONLY TESTING PURPOSE
  useEffect(() => {
    if (invalidProducts) {
      console.log("invalidProducts", invalidProducts);
    }
  }, [invalidProducts]);

  //
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
    addressMutation.mutate({
      address: data.address,
      pinCode: data.pinCode,
      phoneNumber: data.phoneNumber,
    });
  };
  const productRemoveMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: (response) => {
      console.log("productRemoveMutation response--", response);
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      // filter productId from   validProducts array
      const isProductExistValidProducts = validProducts.find(
        (item) => item.product._id === removeProductId
      );
      if (isProductExistValidProducts) {
        const updatedProducts = validProducts.filter(
          (item) => item.product._id !== removeProductId
        );
        setValidProducts(updatedProducts);
      }
      const isProductExistInValidProducts = invalidProducts.find(
        (item) => item.product._id === removeProductId
      );
      if (isProductExistInValidProducts) {
        const updatedProducts = invalidProducts.filter(
          (item) => item.product._id !== removeProductId
        );
        setInvalidProducts(updatedProducts);
      }

      toast.success("Product is remove", "Product is remove from the cart.");
    },
    onError: () => {
      toast.error(
        "Product is not remove",
        "Unable to remove product.Try it again!."
      );
    },
  });
  const handleRemoveProduct = (productId: string) => {
    setRemoveProductId(productId);
    productRemoveMutation.mutate({ productId });
    // remove product form local storage {loginUserCart,logoutUserCart,cart}
    const loginUserCart = JSON.parse(
      localStorage.getItem("loginUserCart") || "[]"
    ) as { id: string; quantity: number }[];
    const logoutUserCart = JSON.parse(
      localStorage.getItem("logoutUserCart") || "[]"
    ) as { id: string; quantity: number }[];
    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as {
      id: string;
      quantity: number;
    }[];
    if (loginUserCart.length > 0) {
      const updatedCart = loginUserCart.filter((item) => item.id !== productId);
      localStorage.setItem("loginUserCart", JSON.stringify(updatedCart));
    }
    if (logoutUserCart.length > 0) {
      const updatedCart = logoutUserCart.filter(
        (item) => item.id !== productId
      );
      localStorage.setItem("logoutUserCart", JSON.stringify(updatedCart));
    }
    if (cart.length > 0) {
      const updatedCart = cart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const addressMutation = useMutation({
    mutationKey: ["updateUserAddress"],
    mutationFn: updateAddress,
    onSuccess: (response) => {
      reset();
      setIsValidUserInfo(true);
      const { isAccessTokenExp, user } = response.data;
      if (isAccessTokenExp) {
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
      const { email, name, pinCode, address, phoneNumber } = user;
      dispatch(addInfo({ address, phoneNumber, pincode: pinCode }));
      setUserName(name);
      setUserAddress(address);
      setUserPhoneNumber(phoneNumber);
      setUserPincode(pinCode);
      setUserEmail(email);
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMsg =
        err.response?.data.message || "Something went wrong.Try it again!";
      setUpdateAddressErrMsg(errorMsg);
    },
  });

  const placeOrderMutation = useMutation({
    mutationKey: ["placeOrder"],
    mutationFn: placeMultipleOrder,
    onSuccess: (response) => {
      /*
      setInvalidProducts
      setOrderPlacedResponse
      */
      const { orders, invalidProducts, validProducts, isAccessTokenExp } =
        response.data;
      //  update user token if exp
      if (isAccessTokenExp) {
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
      if (invalidProducts) {
        setInvalidProducts(invalidProducts);
      }
      setOrderPlacedResponse(orders);
      const grandTotal = orders.reduce((acc: number, order: OrderProps) => {
        const productCurrency = order.productDetails.currency;
        let currencyConvertMultiplier;
        // converting into dolar
        switch (productCurrency) {
          case "INR":
            currencyConvertMultiplier = 0.011;
            break;
          case "USD":
            currencyConvertMultiplier = 1;
            break;
          case "EUR":
            currencyConvertMultiplier = 1.19;
            break;
          case "GBP":
            currencyConvertMultiplier = 1.29;
            break;
          case "RUB":
            currencyConvertMultiplier = 0.011;
            break;
          default:
            currencyConvertMultiplier = 1;
            break;
        }

        acc += order.totalPrice * currencyConvertMultiplier;
        return acc;
      }, 0);
      const totalItems = orders.reduce((acc: number, order: OrderProps) => {
        const quantity = order.quantity;
        acc += quantity;
        return acc;
      }, 0);
      setTotalPrice(grandTotal);
      setTotalQuantity(totalItems);
      setIsOrderPalced(true);
      toast.success(
        "🎉 Thank you! Your order is confirmed.",
        "You can see order detail on order page."
      );
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMsg =
        err.response?.data.message || "Something went wrong.Try it again!";
      setPlaceOrderError(errorMsg);
      toast.error(
        "We're sorry, your order could not be processed.",
        "Don’t worry — you haven’t been charged. Try again or reach out to us for help"
      );
    },
  });

  const handlePlaceOrder = () => {
    // cartVaildProducts
    /*
    setValidProducts
    setInvalidProducts
    */
    const placeOrderProduct: { productId: string; quantity: number }[] = [];
    validProducts.map((item) => {
      const id = item.product._id;
      const quantity = item.quantity;
      placeOrderProduct.push({ productId: id, quantity });
    });
    // placeOrderMutation.mutate(validProducts)
    placeOrderMutation.mutate(placeOrderProduct);
  };

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

  useEffect(() => {
    // setIsValidUserInfo userAddress userPincode
    if (userPincode === "361365" && userAddress === "DUMMY ADDRESS") {
      setIsValidUserInfo(false);
    } else {
      setIsValidUserInfo(true);
    }
    if (userPincode === "" && userAddress === "") {
      setIsValidUserInfo(false);
    }
  }, [userAddress, userPincode]);

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

  return (
    <div className=" container">
      {/* IsOrderPalced */}
      
      {isOrderPalced ? (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 p-4">
        {/* Image Section */}
        <div className="lg:w-[40%] md:flex justify-center items-center mb-8 lg:mb-0 hidden">
          <Image
            src="/order-confirmed.svg"
            alt="Order Success"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
        {/* Order Summary Section */}
        <div className="lg:w-full bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl">
          <div>
            <div className="flex items-center gap-1 bg-green-100 rounded-2xl p-1 px-2  w-[26%] mb-2">
              <CheckCircle className="text-green-600 w-4 h-4" />
              <span className="text-green-600 font-medium">Order Placed</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Thank You! Your Order Is Confirmed
            </h2>
            <p className="text-lg">
              We appreciate your order, we’re currently processing it. So hang
              tight and we’ll send you confirmation very soon!
            </p>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mt-6  border-b-2 pb-2">
            Order Items
          </h3>
          {/* list of confirmed items OrderPlacedResponse */}
          <div className="mt-4 space-y-4">
            {orderPlacedResponse.map((item) => (
              <div key={item.orderId} className="flex items-start space-x-4">
                {/* product img */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={item.productDetails.image}
                    alt={item.productDetails.title}
                    className="w-full h-full object-cover"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.productDetails.title}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    Order status {item.orderStatus}
                  </p>
                  <p className="text-sm text-gray-500">
                    Order PlacedOn {item.orderPlaceOn}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                  {formatPrice(item.totalPrice, item.productDetails.currency)}
                </div>
              </div>
            ))}
            {invalidProducts && 
            (<>
            {invalidProducts.map((item,index)=>(<div key={index} className="flex items-start space-x-4">
                {/* product img */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product.title}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  
                </div>
                <div className="flex-shrink-0 text-sm font-medium text-red-600">
                  {item.reason}
                </div>
              </div>))}
            </>)}
          </div>
          <div className="px-6 py-4  border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-800">
                Payment Details
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-800">$ {totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-800">$ 0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-800">$ 0</span>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Total:
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    $ {totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* userDetails */}
          <div className="px-6 py-4  border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-800">
                Shipping Info
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-800 capitalize">{userName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-800">{userEmail}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Address:</span>
                <span className="text-gray-800 capitalize truncate">
                  {userAddress}
                </span>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-800">
                Payment Type
              </h3>
              <span className="font-medium text-indigo-600">
                : COD (Cash on Delivery)
              </span>
            </div>
          </div>
          <p className="mt-1 mb-4 text-md">
            <span className="font-bold">Note:</span> Order price is calculated
            on dollar currency{" "}
          </p>
          {/* Action Buttons */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Link href={`/orders`}>Track Order</Link>
            </button>
          </div>
        </div>
      </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* UserInfo */}
            <div className="mt-8  lg:w-[40%]">
              {isValidUserInfo ? (
                <div className="border p-2 px-4 rounded-xl drop-shadow shadow ">
                  {/* show user info */}
                  <div className="border-b p-2 rounded-lg flex flex-col gap-2 pb-6">
                    <h2 className="text-xl font-medium mb-4 mt-2 ">
                      Contact information
                    </h2>
                    <div className="flex flex-col items-start gap-1">
                      <span className="block font-medium text-left opacity-80">
                        Email address
                      </span>
                      <span className="w-full p-1 text-black border-none rounded outline-none placeholder:text-stone-800 bg-stone-200/70">
                        {userEmail}
                      </span>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="block font-medium text-left opacity-80">
                        Phone Number
                      </span>
                      <span className="w-full p-1 text-black border-none rounded outline-none placeholder:text-stone-800 bg-stone-200/70">
                        {userPhoneNumber}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 mt-6">
                    <h2 className="text-xl font-medium mb-4 mt-2 ">
                      Shipping information
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="block font-medium text-left opacity-80">
                          Name
                        </span>
                        <span className="w-full p-1 text-black rounded outline-none placeholder:text-stone-800 bg-stone-200/70 capitalize">
                          {userName}
                        </span>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <span className="block font-medium text-left opacity-80">
                          Address
                        </span>
                        <span className="w-full p-1 text-black rounded outline-none placeholder:text-stone-800 bg-stone-200/70 capitalize">
                          {userAddress}
                        </span>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <span className="block font-medium text-left opacity-80">
                          Postal code
                        </span>
                        <div className="w-full  p-1 text-black rounded outline-none placeholder:text-stone-800  border  bg-stone-200/70">
                          {userPincode}
                        </div>
                        <Button
                          className="mt-4 w-[20%] hover:bg-indigo-500 bg-indigo-600 mb-4"
                          onClick={() => setIsValidUserInfo(false)}
                        >
                          Update{" "}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-medium mt-4">
                    Shipping information
                  </h2>
                  <div className="mx-auto  text-center">
                    {addressMutation.isError && (
                      <span className=" mb-1 text-sm text-red-500 text-center ">
                        {updateAddressErrMsg}
                      </span>
                    )}
                  </div>
                  {/* update form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col justify-center  gap-2 p-4 mx-auto border rounded-md shadow mt-4"
                  >
                    <label className="flex flex-col items-start gap-1 ">
                      <span className="block font-medium text-left opacity-80">
                        Address
                      </span>
                      <input
                        type="text"
                        className="w-full p-1 text-black border-none rounded outline-none placeholder:text-stone-800 bg-stone-200"
                        {...register("address")}
                        placeholder="Enter address"
                      />
                    </label>
                    {errors.address && (
                      <span className="text-sm font-medium text-red-600">
                        {errors.address.message}
                      </span>
                    )}
                    <label className="flex flex-col items-start gap-1">
                      <span className="block font-medium text-left opacity-80">
                        Postal code
                      </span>
                      <input
                        type="text"
                        className="w-full p-1 text-black border-none rounded outline-none placeholder:text-stone-800 bg-stone-200"
                        {...register("pinCode")}
                        placeholder="Enter 6 digit pin code"
                      />
                    </label>
                    {errors.pinCode && (
                      <span className="text-sm font-medium text-red-600">
                        {errors.pinCode.message}
                      </span>
                    )}
                    <label className="flex flex-col items-start gap-1">
                      <span className="block font-medium text-left opacity-80">
                        phoneNumber
                      </span>
                      <input
                        type="text"
                        className="w-full p-1 text-black border-none rounded outline-none placeholder:text-stone-800 bg-stone-200"
                        {...register("phoneNumber")}
                        placeholder="Enter 10 digit phone number"
                      />
                    </label>
                    {errors.phoneNumber && (
                      <span className="text-sm font-medium text-red-600">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                    {/* <Button className="mt-4 mb-2 bg-indigo-500 hover:bg-indigo-600">Save</Button> */}
                    <button
                      className={` bg-indigo-500 hover:bg-indigo-600 transition-colors text-stone-100 hover:text-stone-100 font-semibold w-full py-2 rounded-md mt-6 mb-4 flex items-center justify-center gap-2 ${
                        addressMutation.isPending
                          ? "cursor-not-allowed opacity-45"
                          : ""
                      }`}
                      type="submit"
                      disabled={addressMutation.isPending}
                    >
                      {addressMutation.isPending && (
                        <span>
                          <LoaderCircle
                            strokeWidth={2}
                            className="text-bg-cta animate-spin"
                          />
                        </span>
                      )}
                      Submit
                    </button>
                  </form>
                </div>
              )}
            </div>
            {/* User cart info */}
            <div className="lg:w-[58%]  p-2">
              {validProducts.length > 0 && (
                <div className="mt-6 flex flex-col  justify-between">
                  <h3 className="text-gray-900 font-medium text-2xl mb-2">
                    Order summary
                  </h3>
                  {placeOrderError && (
                    <span className="text-md text-center font-medium text-rose-500">
                      {placeOrderError}
                    </span>
                  )}
                  <ul
                    role="list"
                    className=" divide-y divide-gray-200 space-y-2 lg:w-full  p-2"
                  >
                    {validProducts.map((item, index) => (
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
                                {formatPrice(
                                  item.product.price - item.product.salePrice,
                                  item.product.currency
                                )}
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
                                onClick={() =>
                                  handleRemoveProduct(item.product._id)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="lg:w-full mt-6 space-y-6">
                    {/* <h3 className="text-gray-900 font-medium text-xl">
                  Order summary
                </h3> */}
                    <div className="space-y-4 divide-y-2">
                      <div className="flex justify-between text-base font-medium text-gray-900 pb-2">
                        <p className="">Total Items</p>
                        <p>{totalQuantity}</p>
                      </div>
                      <div className="flex justify-between text-base font-medium text-gray-900 pb-2">
                        <p>Subtotal</p>
                        <p>$ {totalPrice}</p>
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
                        <p>$ {totalPrice}</p>
                      </div>

                      <Button
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500  text-md"
                        onClick={handlePlaceOrder}
                        disabled={placeOrderMutation.isPending}
                      >
                        PlaceOrder
                      </Button>
                    </div>
                    <p className="mt-2 text-md">
                      <span className="font-bold">Note:</span> Order price is
                      calculated on dollar currency{" "}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {/* inValid product */}
            {invalidProducts.length > 0 && (
              <div className="space-y-2 mt-6">
                <h2 className="text-xl font-semibold text-rose-600">
                  Oops! Not Enough Items in Stock
                </h2>
                <div className="mt-16 flex flex-col lg:flex-row justify-between">
                  <ul
                    role="list"
                    className="-my-6 divide-y divide-gray-200 space-y-2 lg:w-1/2  p-2"
                  >
                    {invalidProducts.map((item, index) => (
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
                                {formatPrice(
                                  item.product.price - item.product.salePrice,
                                  item.product.currency
                                )}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.product.brand}
                              <span className="text-md capitalize text-red-500 font-medium ml-4 bg-red-100 p-1 rounded-lg px-2">
                                {item.reason}
                              </span>
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm mb-4">
                            <p className="text-gray-500">Qty {item.quantity}</p>

                            <div className="flex flex-col items-start">
                              <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() =>
                                  handleRemoveProduct(item.product._id)
                                }
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
            )}
          </div>
        </>
      )}
    </div>
  );
}

/*
<h2>Oops! Not Enough Items in Stock</h2>
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
