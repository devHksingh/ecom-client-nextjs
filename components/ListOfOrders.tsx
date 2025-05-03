import Link from "next/link";
import React from "react";
import Image from "next/image";

import ShowOrderInfo from "./ShowOrderInfo";

interface OrderProps {
  productDetail: {
    name: string;
    price: number;
    imageUrl: string;
    productId: string;
    currency: string;
  };

  userDetails: {
    userName: string;
    userEmail: string;
  };
  _id: string;
  orderStatus: string;
  orderPlaceOn: string;
  trackingId: string;
  totalPrice: number;
  quantity: number;
}
interface ListOfOrdersProps {
    orders: OrderProps[];
  }

const ListOfOrders = ({ orders }: ListOfOrdersProps) => {
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
          Order history
        </h2>
        <p>Check the status of recent orderss and discover similar products.</p>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {orders.map((order: OrderProps) => (
            <div key={order._id} className="group relative">
              <Image
                src={order.productDetail.imageUrl}
                alt={order.productDetail.name}
                width={150}
                height={150}
                priority
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80  hover:cursor-pointer"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 truncate lg:w-[60%]">
                    <Link href={`/products/${order.productDetail.productId}`} className=" ">
                      <span aria-hidden="true" className="absolute inset-0 " />
                      {order.productDetail.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 mb-2">
                    {order.orderPlaceOn}
                  </p>
                  <ShowOrderInfo orderStatus={order.orderStatus} />
                </div>
                <p className="text-sm font-medium text-gray-900">Qty: {order.quantity}</p>
                
                
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListOfOrders;
