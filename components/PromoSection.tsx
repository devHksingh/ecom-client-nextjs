import Image from "next/image";
import React from "react";

const PromoSection = () => {
  return (
    <div className="relative overflow-hidden bg-white ">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Summer styles are finally here
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              This year, our new summer collection will shelter you from the
              harsh elements of a world that doesn&apos;t care if you live or die.
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 lg:-translate-y-1/2">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        
                        <Image
                        src={'/promo/webp1.webp'}
                        alt="image1"
                        width={150}
                        height={150}
                        className="size-full object-cover bg-stone-200/75"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        
                        <Image
                        src={'/promo/webp2.webp'}
                        alt="image1"
                        width={150}
                        height={150}
                        className="size-full object-cover bg-stone-200/75"
                        />
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        
                        <Image
                        src={'/promo/webp4.webp'}
                        alt="image1"
                        width={150}
                        height={150}
                        className="size-full object-cover bg-stone-200/75"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        
                        <Image
                        src={'/promo/webp3.webp'}
                        alt="image1"
                        width={150}
                        height={150}
                        className="size-full object-cover bg-stone-200/75"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        
                        <Image
                        src={'/promo/webp5.webp'}
                        alt="image1"
                        width={150}
                        height={150}
                        className="size-full object-cover bg-stone-200/75"
                        />
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        
                        <Image
                        src={'/promo/webp6.webp'}
                        alt="image1"
                        width={150}
                        height={150}
                        className="size-full object-cover bg-stone-200/75"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        
                        <Image
                        src={'/promo/webp7.webp'}
                        alt="image1"
                        width={150}
                        height={150}
                        className="size-full object-cover bg-stone-200/75"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#"
                className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
              >
                Shop Collection
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSection;
