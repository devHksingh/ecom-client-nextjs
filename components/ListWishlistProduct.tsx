import { ProductProps } from "@/types/product";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface product {
  products: ProductProps[];
}

const ListWishlistProduct = ({ products }: product) => {
  const router = useRouter();
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
  return (
    // <section className="py-24">
    //   <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
    //     <h2 className="font-manrope font-bold text-3xl min-[400px]:text-4xl text-black mb-8 max-lg:text-center">
    //       Saved for Later
    //     </h2>
    //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    //       {products.map((product) => (
    //         <div key={product._id} className="max-w-[40rem] mx-auto">
    //           <div className="w-full max-w-sm aspect-square">
    //             <Image
    //               src={product.image}
    //               alt={product.title}
    //               width={150}
    //               height={150}
    //               className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 hover:cursor-pointer  "
    //               onClick={() => {
    //                 router.push(`/products/${product._id}`);
    //               }}
    //             />
    //           </div>
    //           <div className="mt-5 flex items-center justify-between">
    //             <div className="">
    //               <h6 className="font-medium text-lg  text-black mb-2 truncate cursor-pointer">
    //                 <Link href={`/products/${product._id}`}>
    //                   {product.title}
    //                 </Link>
    //               </h6>
    //               <h6 className="font-semibold text-xl  text-indigo-600">
    //                 {formatPrice(
    //                   product.price - product.salePrice,
    //                   product.currency
    //                 )}
    //               </h6>
    //             </div>

    // <Button
    //   variant={"ghost"}
    //   className=" cursor-pointer bg-red-100 text-red-600 self-center hover:bg-red-50  hover:text-rose-500"
    // >
    //   <Trash2 />
    // </Button>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </section>
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {/* Customers also purchased */}
          Saved for Later
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product._id}>
              <div>
                <Image
                  src={product.image}
                  alt={product.title}
                  width={150}
                  height={150}
                  onClick={() => {
                    router.push(`/products/${product._id}`);
                  }}
                  className="aspect-square  w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80  hover:cursor-pointer"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 ">
                  
                    <Link href={`/products/${product._id}`}>
                      {product.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                </div>
                <div className=" flex flex-col justify-end items-end gap-2">
                  <p className="text-sm font-medium text-gray-900 ">
                    {formatPrice(
                      product.price - product.salePrice,
                      product.currency
                    )}
                  </p>
                  <Button
                    variant={"ghost"}
                    className=" cursor-pointer bg-red-100 text-red-600 self-center hover:bg-red-50  hover:text-rose-500"
                    // TODO: add handle delete product
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListWishlistProduct;
