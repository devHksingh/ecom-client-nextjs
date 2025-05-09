import { ProductProps } from "@/types/product";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useToast from "@/hook/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeWishlist } from "@/http/api";
import { useAppDispatch } from "@/lib/hooks";
import { updateAccessToken } from "@/lib/store/features/user/authSlice";

interface product {
  products: ProductProps[];
}

const ListWishlistProduct = ({ products }: product) => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const removeWishlistMutation = useMutation({
    mutationFn: removeWishlist,
    onSuccess: async (response) => {
      // invalidate query
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      // refetch query
      // await queryClient.refetchQueries({
      //   queryKey: ["wishlist"],
      //   exact: true,
      // });
      console.log("response.data removeWishlist", response.data);

      const { isAccessTokenExp } = response.data;
      if (isAccessTokenExp) {
        //  token in localStorge and redux state
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const { accessToken: newAccessToken } = response.data;
        dispatch(updateAccessToken({ accessToken: newAccessToken }));
        const { email, id, name, refreshToken } = user;
        const updatedUserData = {
          accessToken: newAccessToken,
          email,
          id,
          name,
          refreshToken,
        };
        sessionStorage.removeItem("user");
        sessionStorage.setItem("user", JSON.stringify(updatedUserData));
      }
    },
    onError: () => {
      toast.error(
        "Request Falied",
        "Failed to remove product on wishlist .Kindly retry!",
        6000
      );
    },
  });
  const handleDeleteProduct = (productId: string, title: string) => {
    removeWishlistMutation.mutate({ productId });
    removeToWishlistToast(title);
  };
  const removeToWishlistToast = (productName: string) => {
    toast.error(
      `${productName} No longer on your wishlist.`,
      "Removed 💔 Want it back? Just add it again.",
      5000
    );
  };
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
                    onClick={() =>
                      handleDeleteProduct(product._id, product.title)
                    }
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
