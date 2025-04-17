import { ProductProps } from "@/types/product";
import Image from "next/image";
import React from "react";

interface product {
  products: ProductProps[];
  headTtitle: string;
}

const ListOfProduct = ({ products, headTtitle }: product) => {
  const formatPrice = (amount: number, currency: string) => {
    let formatedPrice: string;
    switch (currency) {
      case "USD":
        formatedPrice = `${"$"} ${amount}`;
        break;
      case "EUR":
        formatedPrice = `${"$"} ${amount}`;
        break;
      case "INR":
        formatedPrice = `${"₹"} ${amount}`;
        break;
      case "RUB":
        formatedPrice = `${"₽"} ${amount}`;
        break;
      case "GBP":
        formatedPrice = `${"£"} ${amount}`;
        break;
      default:
        formatedPrice = `${"₹"} ${amount}`;
        break;
    }
    return formatedPrice;
  };
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {/* Customers also purchased */}
          {headTtitle}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product._id} className="group relative">
              <Image
                src={product.image}
                alt={product.title}
                width={150}
                height={1501}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 ">
                    {/* TODO: INSERT Link product[id] */}
                    <a href={""}>
                      <span aria-hidden="true" className="absolute inset-0 " />
                      {product.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                </div>
                <p className="text-sm font-medium text-gray-900 ">
                   {formatPrice((product.price - product.salePrice),product.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListOfProduct;
