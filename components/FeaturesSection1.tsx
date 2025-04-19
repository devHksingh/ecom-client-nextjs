import React from "react";
import Image from "next/image";
const FeaturesSection = () => {
  const category = [
    {
      image: "/assets/Men_s_Casual_Shirt1-removebg-preview.webp",
      title: "Clothing",
      describtion: "Clothing category",
      id: "1",
    },
    {
      image: "/assets/Coffee_Table-removebg-preview.webp",
      title: "Furniture",
      describtion: "Furniture category",
      id: "2",
    },
    {
      image: "/assets/Fossil_Men_Leather-removebg-preview.webp",
      title: "Watch",
      describtion: "Watch category",
      id: "3",
    },
    {
      image: "/assets/Boldfit_Badminton_Shoes-removebg-preview.webp",
      title: "Footware",
      describtion: "Footware category",
      id: "4",
    },
    {
      image: "/assets/MacBook_Air_15-removebg-preview.webp",
      title: "Electronics",
      describtion: "Electronics category",
      id: "5",
    },
    {
      image: "/assets/file.avif",
      title: "Grocery",
      describtion: "Grocery category",
      id: "6",
    },
  ];
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 ">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Shop by Category
          {/* {headTtitle} */}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {category.map((cate) => (
            <div key={cate.id} className="group relative">
              <Image
                src={cate.image}
                alt={cate.describtion}
                width={200}
                height={200}
                className="aspect-square w-full rounded-md  object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 mix-blend-darken   hover:cursor-pointer bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-xl text-gray-100   absolute bottom-12 left-1/2 -translate-x-1/2 font-bold lg:text-4xl">
                    {/* TODO: INSERT Link category[id] */}
                    <a href={""}>
                      <span aria-hidden="true" className="absolute inset-0 " />
                      {cate.title}
                    </a>
                  </h3>
                  {/* <p className="mt-1 text-sm text-gray-500">{product.brand}</p> */}
                </div>
                <p className="text-sm font-medium text-gray-900 ">
                  {/* {formatPrice(
                    product.price - product.salePrice,
                    product.currency
                  )} */}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
// bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%
// bg-linear-to-b/hsl from-stone-100 to-stone-950