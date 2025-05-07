"use client";
import useAuth from "@/hook/useAuth";
import {
  ChevronDown,
  Laptop,
  Menu,
  MonitorSmartphone,
  Shirt,
  Store,
  TabletSmartphone,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/http/api";
import { deleteUser } from "@/lib/store/features/user/authSlice";

const NewNavBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isClothNavOpen, setIsClothNavOpen] = useState(false);
  const [isElectronicsNavOpen, setIsElectronicsNavOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  useAuth();
  const dispatch = useAppDispatch()
  const userState = useAppSelector((state) => state.auth);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { isLogin } = userState;
  // Delaying  until login status is determined
  useEffect(() => {
    if (typeof isLogin === "boolean") {
      setAuthChecked(true);
    }
  }, [isLogin]);
  const mutation = useMutation({
    mutationFn: logoutUser,
    onError: () => {},
    onSuccess: () => {
      dispatch(deleteUser());
      sessionStorage.clear();
    },
    // TODO: Toast call logout and  provide all Link
  });
  const handleLogout = () => {
    mutation.mutate();
  };
  const clothing = [
    { name: "Men", href: "#", icon: Shirt },
    {
      name: "Woman",
      description: "formal Woman clothing",
      href: "#",
      icon: Shirt,
    },
  ];
  const electronics = [
    { name: "Phone", href: "#", icon: TabletSmartphone },
    { name: "Laptop", href: "#", icon: Laptop },
    { name: "Accessories", href: "#", icon: MonitorSmartphone },
  ];
  return (
    <header className="bg-white container">
      <nav className="mx-auto flex  items-center justify-between p-6 lg:px-2">
        {/* logo */}
        <div className="flex lg:flex-1">
          <span className="sr-only"> Company Logo</span>
          <Link
            href={"/"}
            className="text-2xl font-bold text-indigo-600 flex items-center gap-1 flex-shrink-0  "
          >
            <Store />
            Shop
          </Link>
        </div>
        {/* mobile menu btn */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <>
                <X
                  className="size-6"
                  aria-hidden="true"
                  aria-label="close menu"
                />
              </>
            ) : (
              <>
                <Menu
                  className="size-6"
                  aria-hidden="true"
                  aria-label="open menu"
                />
              </>
            )}
          </button>
        </div>
        {/* mobile menu */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 top-20  z-100  bg-white">
              <div className="divide-y divide-gray-500/10 border">
                <div className="space-y-2 py-6">
                  <button
                    className={`group ${
                      isClothNavOpen ? `bg-gray-200` : ``
                    }  flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-100`}
                    onClick={() => setIsClothNavOpen(!isClothNavOpen)}
                  >
                    Clothing{" "}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-5 flex-none  ${
                        isClothNavOpen ? `rotate-180` : ``
                      }`}
                    />
                  </button>
                  {isClothNavOpen && (
                    <div>
                      {clothing.map((item, index) => (
                        <div key={index}>
                          <div className="flex hover:bg-gray-100 w-full items-center justify-start gap-2 rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 ">
                            <item.icon
                              aria-hidden="true"
                              className="size-6 text-gray-600 group-hover:text-indigo-600"
                            />
                            <Link href={item.href}>{item.name}</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    className={`group ${
                      isElectronicsNavOpen ? `bg-gray-200` : ``
                    }  flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-200`}
                    onClick={() =>
                      setIsElectronicsNavOpen(!isElectronicsNavOpen)
                    }
                  >
                    Electronics{" "}
                    <ChevronDown
                      className={`size-5 flex-none  ${
                        isElectronicsNavOpen ? `rotate-180` : ``
                      }`}
                    />
                  </button>
                  {isElectronicsNavOpen && (
                    <div>
                      {electronics.map((item, index) => (
                        <div key={index}>
                          <div className="flex hover:bg-gray-100 w-full items-center justify-start gap-2 rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 ">
                            <item.icon
                              aria-hidden="true"
                              className="size-6 text-gray-600 group-hover:text-indigo-600"
                            />
                            <Link href={item.href}>{item.name}</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="group  flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-200">
                    <Link href={"/login"}>About</Link>
                  </button>
                  <button className="group  flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-200">
                    <Link href={"/login"}>Contact</Link>
                  </button>
                  {isLogin && (
                    <>
                      <button className="group  flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-200">
                        <Link href={"/login"}>Cart</Link>
                      </button>
                      <button className="group  flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-200">
                        <Link href={"/login"}>Wishlist</Link>
                      </button>
                    </>
                  )}
                </div>
              </div>
              {isLogin ? (
                <>
                  <button 
                  className=" block bg-red-100 w-full text-start mt-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  onClick={handleLogout}
                  >

                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className=" block bg-amber-100 w-full text-start mt-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    <Link href={"/login"}>Login</Link>
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default NewNavBar;
