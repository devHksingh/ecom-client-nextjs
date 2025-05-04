import React from "react";
import Image from "next/image";
import { OrderProgressBar } from "./OrderProgressBar";
import { OrderProps } from "@/app/orders/[orderId]/page";
import ShowOrderInfo from "./ShowOrderInfo";

interface SingleOrderSummaryProps {
  order: OrderProps;
}
const SingleOrderSummary = ({ order }: SingleOrderSummaryProps) => {
    const formatPrice = (amount: number, currency: string) => {
        let formatedPrice: string;
        switch (currency) {
          case "USD":
            formatedPrice = `${"$"}${amount.toLocaleString("en-IN")}`;
            break;
          case "EUR":
            formatedPrice = `${"$"}${amount.toLocaleString("en-IN")}`;
            break;
          case "INR":
            formatedPrice = `${"₹"}${amount.toLocaleString("en-IN")}`;
            break;
          case "RUB":
            formatedPrice = `${"₽"}${amount.toLocaleString("en-IN")}`;
            break;
          case "GBP":
            formatedPrice = `${"£"}${amount.toLocaleString("en-IN")}`;
            break;
          default:
            formatedPrice = `${"₹"}${amount.toLocaleString("en-IN")}`;
            break;
        }
        return formatedPrice;
      };
  const formateDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <p className="text-gray-600">
        Tracking ID: <strong>{order.trackingId}</strong>  
      </p>
      <p className="text-gray-600">Placed on {" "}
      <span className="font-medium">{formateDate(order.orderPlaceOn)}</span></p>
      <div className="mt-10">
        <OrderProgressBar status={order.orderStatus} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-4 rounded shadow">
          <Image
            src={order.productDetail.imageUrl}
            alt={order.productDetail.name}
            width={500}
            height={500}
            className="rounded-lg object-contain"
          />
        </div>
        <div>
          <div className="mb-2">
            <ShowOrderInfo orderStatus={order.orderStatus} />
          </div>
          <h2 className="text-xl font-semibold">{order.productDetail.name}</h2>
          <p className="text-gray-600 mb-2">Quantity: {order.quantity}</p>
          <p className="text-md font-bold mb-2">
            {formatPrice(order.productDetail.price,order.productDetail.currency)}
          </p>

          <p className=" text-gray-600 font-medium text-xl">
            Total: {formatPrice(order.totalPrice,order.productDetail.currency)}
          </p>

          <div className="mt-6">
            <h3 className="font-semibold">Customer details</h3>
            <p className=" capitalize">Name: {order.userDetails.userName}</p>
            <p className="text-sm text-gray-500">
              Email: {order.userDetails.userEmail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderSummary;
