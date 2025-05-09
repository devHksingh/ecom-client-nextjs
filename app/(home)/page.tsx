"use client";
import Carousel from "@/components/Carousel";
import FeaturesSection from "@/components/FeaturesSection1";
import ListOfProduct from "@/components/ListOfProduct";
import PromoSection from "@/components/PromoSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import useAuth from "@/hook/useAuth";

import { homePageProduct, userCustomizeProduct } from "@/http/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateAccessToken } from "@/lib/store/features/user/authSlice";
import { useQuery } from "@tanstack/react-query";
import { CalendarSync, RefreshCcw, Truck } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mostBoughtProduct, setMostBoughtProduct] = useState([]);
  const [mostExpensiveProduct, setMostExpensiveProduct] = useState([]);
  const [leastExpensiveProduct, setLeastExpensiveProduct] = useState([]);
  const [usersProduct, setUsersProduct] = useState([]);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const userState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useAuth();
  
  // isLoading, isError, error
  const { data } = useQuery({
    queryKey: ["homePageProducts"],
    queryFn: homePageProduct,
    staleTime: 40 * 60 * 1000,
    refetchInterval: 41 * 60 * 1000,
    refetchIntervalInBackground: true,
  });
  const { data: customizeUserProduct } = useQuery({
    queryKey: ["customizeProduct"],
    queryFn: userCustomizeProduct,
    staleTime: 40 * 60 * 1000,
    refetchInterval: 41 * 60 * 1000,
    refetchIntervalInBackground: true,
    enabled: userState.isLogin,
  });
  useEffect(() => {
    if (userState.isLogin) {
      setIsUserLogin(true);
    }
  }, [userState.isLogin]);
  useEffect(() => {
    if (customizeUserProduct) {
      setUsersProduct(customizeUserProduct.data.firstTwelveProduct);
      console.log(customizeUserProduct);
      console.log("isLogin", customizeUserProduct.data.isAccessTokenExp);
      if (customizeUserProduct.data.isAccessTokenExp) {
        const { refreshToken, userId, userName, useremail } = userState;
        dispatch(
          updateAccessToken({
            accessToken: customizeUserProduct.data.accessToken,
          })
        );
        sessionStorage.clear();
        const user = {
          id: userId,
          name: userName,
          email: useremail,
          refreshToken,
          accessToken: customizeUserProduct.data.accessToken,
        };
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      //
    }
  }, [customizeUserProduct, dispatch, userState]);
  useEffect(() => {
    if (data) {
      setMostBoughtProduct(data.data.top8MostBoughtProduct);
      setMostExpensiveProduct(data.data.top8MostExpensiveProduct);
      setLeastExpensiveProduct(data.data.top8LeastExpensiveProduct);
    }
  }, [data]);

  const carouselItems = [
    {
      id: 1,
      imgSrc: "/assets/Boldfit_Badminton_Shoes-removebg-preview.webp",
      title: "Find Your Sole Mate",
      description: "Shoes for work, play, and everything between.",
      tagLine: "All-day support without sacrificing looks.",
      color: "bg-amber-100",
    },
    {
      id: 2,
      imgSrc: "/assets/Dell_Alienware_m16_R1-removebg-preview.webp",
      title: "Power Up Productivity",
      description: "Laptops made to work, play, and create faster.",
      tagLine: "From gaming to grind—performance meets design.",
      color: "bg-blue-100",
    },
    {
      id: 3,
      imgSrc: "/assets/MacBook_Air_15-removebg-preview.webp",
      title: "Sleek Meets Smart",
      description:
        "From coffee shops to boardrooms, the MacBook Air 15” brings effortless portability and all-day battery life to your daily workflow.",
      tagLine: "New Arrival: Built to Impress, Ready to Go",
      color: "bg-amber-100",
    },
    {
      id: 4,
      imgSrc: "/assets/Fossil_Men_Leather-removebg-preview.webp",
      title: "Timeless Craftsmanship in Leather",
      description:
        "Elevate your everyday look with Fossil’s premium leather collection—where rugged charm meets refined detail. Perfectly aged, endlessly versatile.",
      tagLine: "Featured: Classic Meets Modern Elegance",
      color: "bg-blue-100",
    },
    {
      id: 5,
      imgSrc: "/assets/Sony_WH-1000XM5-removebg-preview.webp",
      title: "Crystal Clear Sound",
      description: "Wireless audio that doesn’t miss a beat.",
      tagLine: " Featured: Studio-Quality Sound Anywhere",
      color: "bg-green-100",
    },
    {
      id: 6,
      imgSrc: "/assets/Men_s_Casual_Shirt1-removebg-preview.webp",
      title: "Fresh Fits. Daily Drops.",
      description: "Streetwear, formal, or laid-back. Dress the way you feel.",
      tagLine: "From errands to evenings out—dress with ease.",
      color: "bg-orange-100",
    },
    {
      id: 7,
      imgSrc: "/assets/twilightGray.webp",
      title: "Silence the World, Hear the Music",
      description:
        "With active noise cancellation and long battery life, tune in to what matters most.",
      tagLine: "Sleek, sharp, and seriously powerful.",
      color: "bg-green-100",
    },
  ];
  
  return (
    <div className="container bg-white scroll-smooth">
      <div className=" mx-auto py-4">
        {/* <ImageCarousel items={carouselItems} autoSlideInterval={5000} /> */}
      </div>
      <div className="">
        <Carousel items={carouselItems} autoSlideInterval={3000} />
      </div>
      <section className="mt-18  mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3  ">
          <div className="flex items-center  justify-start  xl:justify-center gap-4 lg:gap-6 px-2 ">
            <CalendarSync className="text-indigo-600 " size={32} />
            <div>
              <h2 className="text-lg lg:text-lg font-semibold text-stone-400">
                We’ll replace it with a new one
              </h2>
              <p className="text-xl lg:text-xl font-medium">
                30-days all-inclusive warranty
              </p>
            </div>
          </div>
          <div className="flex items-center  justify-start  xl:justify-center gap-4 lg:gap-6 px-2 ">
            <RefreshCcw className="text-indigo-600 " size={32} />
            <div>
              <h2 className="text-lg lg:text-lg font-semibold text-stone-400">
                Send it back for free
              </h2>
              <p className="text-lg lg:text-xl font-medium">
                Free shipping on returns
              </p>
            </div>
          </div>
          <div className="flex items-center  justify-start  xl:justify-center gap-4 lg:gap-6 px-2 ">
            <Truck className="text-indigo-600 " size={32} />
            <div>
              <h2 className="text-lg lg:text-lg font-semibold text-stone-400">
                The shipping is on us
              </h2>
              <p className="text-lg lg:text-xl font-medium">
                Free, contactless delivery
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-18 ">
        <PromoSection />
      </section>
      <section className="mt-18 ">
        <FeaturesSection />
      </section>
      {isUserLogin && (
        <section className="mt-8 ">
          <ListOfProduct
            products={usersProduct}
            headTtitle="Get It Just the Way You Want"
          />
        </section>
      )}
      <section className="">
        <ListOfProduct
          products={mostBoughtProduct}
          headTtitle="Trending Products"
        />
      </section>
      <section className="">
        <ListOfProduct
          products={mostExpensiveProduct}
          headTtitle="Luxury Picks: The Finest on Display"
        />
      </section>
      <section className="">
        <ListOfProduct
          products={leastExpensiveProduct}
          headTtitle="Great Deals, Small Price"
        />
      </section>

      {/* faq */}
      <section className="mb-16">
        <h2 className="text-4xl lg:text-4xl  font-manrope text-center font-bold text-gray-900 leading-[3.25rem] mb-6 lg:mb-12">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="w-full lg:w-1/2  mx-auto ">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-2xl">
              How can I track my order status?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              You can track your order by visiting the “My Orders” section in
              nav bar.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" >
            <AccordionTrigger className="text-2xl">How long does shipping take?</AccordionTrigger>
            <AccordionContent  className="text-lg">
              Standard shipping usually takes 8 to 14 business days. Express
              shipping options are available at checkout for faster delivery.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" >
            <AccordionTrigger className="text-2xl">
              Do you offer international shipping?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Yes, we currently ship to selected countries. Shipping fees and
              delivery times vary by destination and will be calculated at
              checkout.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-2xl">
              Do you support international currency?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Yes, we can support international currency but final order cost is
              calculated on based on dollar currency.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}

