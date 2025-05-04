import SingleOrderSummary from "@/components/SingleOrderSummary";

export interface OrderProps{
    productDetail:{
        name:string,
        price:number,
        imageUrl:string,
        productId:string,
        currency:string,
    },
    userDetails:{
        userName:string,
        userEmail:string,
    },
    _id:string,
    orderStatus:string,
    orderPlaceOn:string,
    trackingId:string,
    totalPrice:number,
    quantity:number,
    createdAt:string,
    
    __v:number,
    
}
export default async function SingleOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  
  console.log("orderId", orderId);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/getOrderByTrackingId/${orderId}`,
    {
      next: {
        revalidate: 600, // Revalidate every 10 MIN
      },
    }
  );
  let order:OrderProps
  if (res.ok) {
    const orderRes = await res.json();
    
    
    console.log("trackingId",orderRes.order[0]);
    order = orderRes.order[0]
  }
  
  return (
    <div className=" container">
        {order! ? <SingleOrderSummary order={order} /> : <></>}
    </div>
  )
}
