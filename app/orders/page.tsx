"use client";

import ListOfOrders from "@/components/ListOfOrders";
import { getAllOrders } from "@/http/api";
import { useAppDispatch } from "@/lib/hooks";
import { updateAccessToken } from "@/lib/store/features/user/authSlice";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const [, setUserSesssionData] = useState({});
  const [userOrders, setUserOrders] = useState([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  // redirect to login if user info not found
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

    if (!storedUser || !storedUser.accessToken) {
      router.replace("/login");
    } else {
      setUserSesssionData(storedUser);
    }
  }, [router]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["userOrders"],
    queryFn: getAllOrders,
  });
  useEffect(() => {
    if (data) {
      console.log("data", data);
      const { order, isAccessTokenExp } = data.data;
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
      setUserOrders(order);
    }
  }, [data]);
  if (isLoading) {
    return (
      <div className="spinner-card bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex min-h-screen justify-center  items-center gap-4">
        <h2 className="font-semibold text-lg dark:text-white text-center">
          Fetching order details
        </h2>
        <div className="flex gap-2 ">
          <div className="animate-bounce w-1 h-1 rounded-full bg-purple-500 dark:bg-purple-400"></div>
          <div className="animate-bounce w-1 h-1 rounded-full bg-purple-500 dark:bg-purple-400"></div>
          <div className="animate-bounce w-1 h-1 rounded-full bg-purple-500 dark:bg-purple-400"></div>
        </div>
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-50"></div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="container">
        <div className="mt-8 text-red-500 text-lg text-center p-2">
          <p>
            We are facing an error while loading your order page.Try it again!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="min-h-screen">
        {userOrders && <ListOfOrders orders={userOrders} />}
      </div>
    </div>
  );
}
