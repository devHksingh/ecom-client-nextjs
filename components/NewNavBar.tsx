"use client";
import useAuth from "@/hook/useAuth";
import {
  ChevronDown,
  Laptop,
  LogOut,
  Menu,
  MonitorSmartphone,
  Shirt,
  Store,
  TabletSmartphone,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/http/api";
import { deleteUser } from "@/lib/store/features/user/authSlice";

const NewNavBar = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setAuthChecked] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  //   const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isClothNavOpen, setIsClothNavOpen] = useState(false);
  const [isElectronicsNavOpen, setIsElectronicsNavOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clothingRef = useRef<HTMLDivElement | null>(null);
  const electronicsRef = useRef<HTMLDivElement | null>(null);

  useAuth();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.auth);
  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);
  const { isLogin } = userState;
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        clothingRef.current &&
        !clothingRef.current.contains(target) &&
        electronicsRef.current &&
        !electronicsRef.current.contains(target)
      ) {
        setIsClothNavOpen(false);
        setIsElectronicsNavOpen(false);
      }

      if (clothingRef.current && !clothingRef.current.contains(target)) {
        setIsClothNavOpen(false);
      }

      if (electronicsRef.current && !electronicsRef.current.contains(target)) {
        setIsElectronicsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    { name: "Men", href: "/clothing/men", icon: Shirt },
    {
      name: "Woman",
      description: "formal Woman clothing",
      href: "/clothing/women",
      icon: Shirt,
    },
  ];
  const lgNavClothing = [
    {
      name: "Men",
      href: "/clothing/men",
      imgSrc: "/assets/Men_s_Casual_Shirt1-removebg-preview.webp",
      title: "Mens Casual Shirt.",
    },
    {
      name: "Woman",
      href: "/clothing/women",
      imgSrc: "/promo/webp7.webp",
      title: " Woman clothing.",
    },
  ];
  const lgNavElectronics = [
    {
      name: "Phone",
      href: "/electronics/phones",
      imgSrc: "/assets/iPhone_16_Pro-removebg-preview.webp",
      title: "iPhone 16.",
    },
    {
      name: "Laptop",
      href: "/electronics/laptops",
      imgSrc: "/assets/MacBook_Air_15-removebg-preview.webp",
      title: "MacBook Air.",
    },
    {
      name: "Accessories",
      href: "/electronics/accessories",
      imgSrc: "/assets/Sony_WH-1000XM5-removebg-preview.webp",
      title: "Headphone.",
    },
  ];
  const electronics = [
    { name: "Phone", href: "/electronics/phones", icon: TabletSmartphone },
    { name: "Laptop", href: "/electronics/laptops", icon: Laptop },
    {
      name: "Accessories",
      href: "/electronics/accessories",
      icon: MonitorSmartphone,
    },
  ];
  return (
    <header className=" bg-white">
      <div className=" container mx-auto">
        <nav className="flex items-center justify-between p-6 lg:px-2   w-full">
          {/* logo */}
          <div className="flex items-center gap-2">
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
              <div className="fixed inset-0 top-20  z-100  bg-white lg:hidden">
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
                          <Link href={"/cart"}>Cart</Link>
                        </button>
                        <button className="group  flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-200">
                          <Link href={"/wishList"}>Wishlist</Link>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {isLogin ? (
                  <>
                    <button
                      className="  flex items-center gap-2 bg-red-100 w-full text-start mt-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      Logout <LogOut aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <>
                    <button className=" block bg-amber-100 w-full text-start mt-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      <Link href={"/login"}>
                        Login <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
          {/* search box */}
          {/* <Search className="hidden lg:flex order-2"/> */}

          {/* lg screen menu */}
          <div className="hidden lg:flex space-x-16 ">
            <div className="flex gap-2 items-center">
              {/* Clothing btn */}
              <div
                className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 p-1 px-2 hover:border-b hover:border-gray-600"
                onClick={() => {
                  setIsClothNavOpen(!isClothNavOpen);
                  setIsElectronicsNavOpen(false);
                }}
              >
                <button className="capitalize">Clothing</button>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-5 flex-none  ${
                    isClothNavOpen ? `rotate-180` : ``
                  }`}
                />
              </div>
              {isClothNavOpen && (
                <>
                  <div
                    className=" flex  bg-stone-100 fixed inset-0 top-16  z-100  w-[28%] left-[30%] lg:bolck p-2 rounded-lg h-[56%]"
                    ref={clothingRef}
                  >
                    <div className=" w-full">
                      {lgNavClothing.map((item, index) => (
                        <div key={index}>
                          <Link href={item.href}>
                            <div className="flex  hover:bg-gray-200 w-full items-center justify-start gap-2 rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 ">
                              <Image
                                src={item.imgSrc}
                                alt={item.title}
                                width={180}
                                height={20}
                              />
                              <p>{item.name}</p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* electronics btn */}
              <div
                className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 p-1 px-2 hover:border-b hover:border-gray-600 "
                onClick={() => {
                  setIsElectronicsNavOpen(!isElectronicsNavOpen);
                  setIsClothNavOpen(false);
                }}
              >
                <button className=" capitalize">electronics</button>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-5 flex-none  ${
                    isElectronicsNavOpen ? `rotate-180` : ``
                  }`}
                />
              </div>
              {isElectronicsNavOpen && (
                <>
                  <div
                    className=" flex  bg-stone-100 fixed inset-0 top-16  z-100  w-[28%] left-[30%] lg:bolck p-2 rounded-lg h-[64%]"
                    ref={electronicsRef}
                  >
                    <div className=" w-full">
                      {lgNavElectronics.map((item, index) => (
                        <div key={index}>
                          <Link href={item.href}>
                            <div className="flex  hover:bg-gray-200 w-full items-center justify-start gap-2 rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 ">
                              <Image
                                src={item.imgSrc}
                                alt={item.title}
                                width={180}
                                height={20}
                              />
                              <p>{item.name}</p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* about btn */}
              <div className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 hover:border-b-1 hover:border-gray-600">
                <button className=" capitalize p-1 rounded-2xl px-2">
                  <Link href={"/about"}>About</Link>
                </button>
              </div>
              {/* about btn */}
              <div className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 hover:border-b-1 hover:border-gray-600">
                <button className=" capitalize p-1 rounded-2xl px-2">
                  <Link href={"/contact"}>Contact</Link>
                </button>
              </div>
              {/* contact btn */}
              {isLogin && (
                <>
                  {/* cart btn */}
                  <div className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 hover:border-b-1 hover:border-gray-600">
                    <button className=" capitalize p-1 rounded-2xl px-2">
                      <Link href={"/cart"}>cart</Link>
                    </button>
                  </div>
                  {/* wishlist btn */}
                  <div className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 hover:border-b-1 hover:border-gray-600">
                    <button className=" capitalize p-1 rounded-2xl px-2">
                      <Link href={"/wishList"}>wishlist</Link>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div>
              {isLogin ? (
                <Button
                  className="bg-red-50 hover:bg-red-100"
                  variant={"ghost"}
                  onClick={handleLogout}
                  disabled={mutation.isPending}
                >
                  Logout <LogOut aria-hidden="true" />
                </Button>
              ) : (
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  <Link href={"/login"}>
                    Login <span aria-hidden="true">&rarr;</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NewNavBar;
