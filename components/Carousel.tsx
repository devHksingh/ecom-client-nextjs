"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface CarouselItem {
  id: number;
  imgSrc: string;
  title: string;
  description: string;
  tagLine: string;
  color:string
}
interface ImageCarouselProps {
  items: CarouselItem[];
  autoSlideInterval?: number;
}

const Carousel = ({ items, autoSlideInterval = 5000 }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // prev and next btn handler
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        handleNext();
      }, autoSlideInterval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoSlideInterval, handleNext, isAutoPlaying]);

  // Pause auto-slide on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };
  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };
  // Function to go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className=" w-full  ">
      <div
        className="relative w-full max-w-8xl mx-auto h-[40rem] overflow-hidden rounded-lg shadow-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Carousel content */}
        <div
          className="h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="min-w-full h-full relative flex flex-col lg:flex-row items-center justify-around bg-black/5 gap-2 ">
              <div className={`order-1 lg:order-2   relative  aspect-auto `}>
                <Image
                  className="w-auto  min-h-80 p-2 object-cover shadow-2xl  aspect-auto transition-all duration-300 hover:scale-105 bg-amber-50/50 rounded-lg"
                  src={item.imgSrc}
                  alt={item.title}
                  width={150}
                  height={450}
                />
                <div className="absolute -bottom-18 left-1/2 w-full -translate-x-1/2 transform">
                <div
                  className={`rounded-xl p-2 text-center font-semibold shadow-lg transition-all duration-300 sm:p-4 ${item.color}`}
                >
                  {item.tagLine}
                </div>
              </div>
              </div>
              <div className=" p-6 text-black order-2 lg:order-1 space-y-0.5 lg:max-w-[50%]">
                <h3 className="text-4xl lg:text-8xl font-bold mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm lg:text-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation arrows */}
        <button
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-all"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-all"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index
                  ? "bg-stone-600"
                  : "bg-stone-400/50  hover:opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
/*
w-auto h-auto  object-cover   aspect-square
border absolute top-1/2 right-20 h-96 p-4 -translate-y-1/2 rounded-2xl shadow-md bg-green-400
absolute inset-0 bg-black/10  flex flex-col justify-end
*/