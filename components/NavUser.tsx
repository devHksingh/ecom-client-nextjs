"use client";
import React, { useEffect, useRef, useState } from "react";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/http/api";
import { deleteUser } from "@/lib/store/features/user/authSlice";
import useAuth from "@/hook/useAuth";
import { useRouter } from "next/navigation";


const NavUser = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const store = useAppStore();
  const { auth } = store.getState();
  const { isLogin, accessToken, refreshToken } = auth;
  const router = useRouter();
  useAuth()
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const dispatch = useAppDispatch();
  const mutation = useMutation({
    mutationFn: logoutUser,
    onError: () => {},
    onSuccess: () => {
      console.log("logout successfully");
      dispatch(deleteUser());
      sessionStorage.clear();
      setIsUserLogin(false)
      router.push('/')
    },
    // TODO: Toast call logout and  provide all Link
  });
  const handleLogout = () => {
    console.log("btn click")
    mutation.mutate();
  };

  useEffect(() => {
    if (isLogin && accessToken && refreshToken) {
      setIsUserLogin(true);
    }
  }, [accessToken, isLogin, refreshToken]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen]);

  return (
    <div className=" ">
      <div className=" flex justify-center ">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            openModal();
          }}
          className=" rounded-full  cursor-pointer"
        >
          <CircleUserRound className="hover:text-red-400" />
        </button>

        {isOpen && isModalOpen && (
          <div
            className="top-12 z-40  bg-stone-50 absolute w-[20%] mx-auto p-1 rounded-md "
            ref={modalRef}
          >
            <p
              hidden={!isUserLogin}
              className="p-2 hover:bg-blue-200 rounded-lg"
            >
              <Link href={""} className="w-full  p-1 flex justify-around cursor-pointer">Profile</Link>
            </p>
            {/* <p
              hidden={isUserLogin}
              className="p-2 hover:bg-blue-200 rounded-lg"
            >
              <Link href={"/login"}>SignIn</Link>
            </p> */}
            <p
              hidden={isUserLogin}
              className=" hover:bg-blue-200 rounded-lg  p-1"
            >
              <Link href={"/login"} className="w-full  p-1 flex justify-around cursor-pointer">SignIn</Link>
            </p>
            
            <p
              hidden={isUserLogin}
              className={`p-1 hover:bg-blue-200 rounded-lg ${
                isUserLogin ? `` : `bg-amber-200`
              }`}
            >
              <Link href={"/register"} className="w-full  p-1 flex justify-around cursor-pointer">SignUp</Link>
            </p>
            <p
              hidden={!isUserLogin}
              className="p-2 hover:bg-blue-200 rounded-lg"
            >
              <Link href={""} className="w-full  p-1 flex justify-around cursor-pointer">Order</Link>
            </p>
            <p className="p-2 hover:bg-blue-200 rounded-lg">
              <Link href={""} className="w-full  p-1 flex justify-around cursor-pointer">Cart</Link>
            </p>
            <p className="p-2 hover:bg-blue-200 rounded-lg">
              <Link href={""} className="w-full  p-1 flex justify-around cursor-pointer">WishList</Link>
            </p>
            <p
              hidden={!isUserLogin}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
            >
              <button onClick={handleLogout} disabled={mutation.isPending}>Logout</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavUser;
