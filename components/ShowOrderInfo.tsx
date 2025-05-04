import { CheckCircle, Package, Truck } from "lucide-react";
import React from "react";

interface OrderStatusProps {
  orderStatus: string;
}

const ShowOrderInfo = ({ orderStatus }: OrderStatusProps) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PROCESSED":
        return {
          icon: <Package className="w-5 h-5 text-blue-500" />,
          color: "bg-blue-100 text-blue-800",
          text: "Processing",
        };
      case "SHIPPED":
        return {
          icon: <Truck className="w-5 h-5 text-orange-500" />,
          color: "bg-orange-100 text-orange-800",
          text: "Shipped",
        };
      case "DELIVERED":
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "bg-green-100 text-green-800",
          text: "Delivered",
        };
      default:
        return {
          icon: <Package className="w-5 h-5 text-gray-500" />,
          color: "bg-gray-100 text-gray-800",
          text: status,
        };
    }
  };

  const statusInfo = getStatusInfo(orderStatus);
  return (
    <div className="flex items-center space-x-1">
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.icon}
        <span className="ml-1 font-medium">{statusInfo.text}</span>
      </span>
    </div>
  );
};

export default ShowOrderInfo;
