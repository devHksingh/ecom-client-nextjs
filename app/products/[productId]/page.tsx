import ListOfProduct from "@/components/ListOfProduct";
import ReadMoreText from "@/components/ReadMoreText";
import { ProductProps } from "@/types/product";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// async function getProduct(id: string) {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${id}`,
//       {
//         next: {
//           revalidate: 3600, // Revalidate every hour
//         },
//       }
//     );
//     if(!res.ok){
//         throw new Error('Product not Found')
//     }
//     const product = await res.json()
//     return product
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     const err = 'Error fetching product:'
//     throw err
//   }
// }

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  //   const product = await getProduct(productId);
  console.log("productId", productId);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`,
    {
      next: {
        revalidate: 3600, // Revalidate every hour
      },
    }
  );
  let product: ProductProps | undefined;
  let productCategory: string = "";
  if (res.ok) {
    const productRes = await res.json();
    product = productRes.productDetail;
  }
  if (product) {
    const categories = product.category;
    if (categories.includes("Electronics")) {
      productCategory = "Electronics";
    }
    if (categories.includes("Grocery")) {
      productCategory = "Grocery";
    }
    if (categories.includes("Clothing")) {
      productCategory = "Clothing";
    }
    if (categories.includes("Headphone")) {
      productCategory = "Headphone";
    }
    if (categories.includes("Footwear")) {
      productCategory = "Footwear";
    }
    if (categories.includes("Watch")) {
      productCategory = "Watch";
    }
    if (categories.includes("Laptop")) {
      productCategory = "Laptop";
    }
  }
  let categoryData: ProductProps[] = [];
  if (product) {
    const data = {
      limit: 8,
      skip: 0,
      category: product.category,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/getProductByCategoryWithLimit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        next: {
          revalidate: 3600, // optional if you want caching
        },
      }
    );

    const pes = await response.json();

    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`,
    //   {
    //     next: {
    //       revalidate: 3600,
    //     },
    //   }
    // );
    if (response.ok) {
      // const cateData = await res.json()
      console.log("cate", pes.products);
      console.log("cate", pes);
      categoryData = pes.products;
    }
  }
  const formatPrice = (amount: number, currency: string) => {
    let formatedPrice: string;
    switch (currency) {
      case "USD":
        formatedPrice = `${"$"}${amount}`;
        break;
      case "EUR":
        formatedPrice = `${"$"}${amount}`;
        break;
      case "INR":
        formatedPrice = `${"₹"}${amount}`;
        break;
      case "RUB":
        formatedPrice = `${"₽"}${amount}`;
        break;
      case "GBP":
        formatedPrice = `${"£"}${amount}`;
        break;
      default:
        formatedPrice = `${"₹"}${amount}`;
        break;
    }
    return formatedPrice;
  };

  return (
    <div className=" container">
      {product && (
        <div className="pt-6 antialiased ">
          <div aria-label="Breadcrumb">
            <ol
              role="list"
              className="flex items-center max-w-2xl gap-2 px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8"
            >
              <li>
                <Link
                  href={"/"}
                  className="font-medium text-stone-800 hover:cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li className="text-stone-400">\</li>
              <li>
                <Link
                  // TODO : ADD CATEGORY LINK
                  href={""}
                  className="font-medium capitalize text-stone-800 hover:cursor-pointer"
                >
                  {productCategory}
                </Link>
              </li>
              <li className="text-stone-400">\</li>
              <li>
                <Link
                  href={`/products/${product._id}`}
                  className="font-medium text-stone-500 hover:cursor-pointer"
                >
                  {product.title}
                </Link>
              </li>
            </ol>
          </div>
          {/* Image  */}
          <div className="grid max-w-2xl grid-cols-1 mx-auto antialiased sm:px-6 lg:max-w-7xl lg:px-8 lg:grid-cols-2">
            {/* Image  */}

            {/* <div className="flex justify-center w-1/2 mx-auto lg:w-full">
          
          <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                // sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
          </div> */}
            <div className="flex justify-center items-center bg-white p-6 rounded-lg">
              <div className="relative h-72 w-72 md:h-96 md:w-96 lg:w-[50rem] lg:h-[36rem]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain transition-all duration-300 ease-in-out hover:scale-120 "
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            {/* content */}
            <div>
              <div className="max-w-2xl px-4 pt-10 mx-auto space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex flex-col border-b-2">
                  <h1 className="text-4xl font-bold space-y-2">
                    {product.title}
                  </h1>
                  <span>{product.brand}</span>

                  <div className="flex flex-wrap items-center gap-2 md:gap-6 pt-2 font-mono text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    <span className="mr-2 text-2xl font-bold shrink-0">
                      Price :{" "}
                      {formatPrice(
                        product.price - product.salePrice,
                        product.currency
                      )}
                    </span>
                    {product.salePrice < product.price && (
                      <span className="text-lg line-through font-medium shrink-0">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    )}
                    <span className="md:ml-4 text-lg text-orange-400 ">
                      {formatPrice(product.salePrice, product.currency)} OFF
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 text-sm font-medium  rounded-full inline-block w-[20%] text-center mt-2 ${
                      product.totalStock < 10
                        ? `text-red-700 bg-red-100`
                        : `text-lime-700 bg-lime-100`
                    }`}
                  >
                    InStock{" "}
                    {product.totalStock < 10 ? `${product.totalStock}` : ``}{" "}
                  </span>

                  <h2 className="mt-2 mb-2 text-lg font-semibold">
                    Categories:
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.category.map((cat: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  {/* <h2 className="flex items-center gap-6 pt-2 font-mono text-2xl font-extrabold text-gray-900 sm:text-3xl ">${product.price} <span className="flex "></span></h2> */}
                  <div className="flex items-center gap-4 pt-4 mb-6 mt-6">
                    <button
                      // onClick={()=>handleUpdateWishListState(product.id)}
                      className="flex px-2 py-1.5 bg-stone-500 rounded-md hover:bg-stone-600 text-white gap-2"
                    >
                      <Heart />
                      Add To Favorites
                    </button>
                    <button
                      // onClick={()=>handleUpdateCartState(product.id)}
                      className="flex px-2 py-1.5 bg-blue-500 rounded-md hover:bg-blue-700 text-white gap-2"
                    >
                      <ShoppingCart />
                      Add To Cart
                    </button>
                  </div>
                </div>
                <div className="p-1 mt-1">
                  {/* <p className="mb-6 text-gray-600 ">{product?.description}</p> */}
                  <ReadMoreText text={product.description} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {categoryData.length && (
        <ListOfProduct
          headTtitle="Customers also purchased "
          products={categoryData}
        />
      )}
    </div>
  );
}
// https://fakestoreapi.com
// app/products/[id]/page.tsx

// import { notFound } from "next/navigation";

// interface Params {
//   params: {
//     productId: string;
//   };
// }

// const SingleProductPage = async ({ params }: { params: { id: string } }) => {
//     const { id } = await params
//   let product;
//   const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
//     // Next.js 15 recommended fetch options
//     next: {
//       revalidate: 3600, // Revalidate every hour
//     },
//   });
//   if (!res.ok) return notFound();
//   console.log("res",res);
//   if(res.ok){
//     product = await res.json();
//   }

//   //   const res = await fetch(
//   //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`
//   //   );

//   //   if (!res.ok) return notFound();

//   //   const product = await res.json();

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
//       <p className="text-gray-700">{product.price}</p>
//     </div>
//   );
// };

// export default SingleProductPage;

// // const SingleProductPage = async ({params}:{params:Promise<{productId:string}>}) => {

// //     const productId =  (await params).productId
// //     let product
// //     if(productId){
// //         const res = await fetch(`https://jsonplaceholder.typicode.com/users/1${productId}`)
// //         product = await res.json()
// //     }
// //   return (
// //     <div>SingleProductPage{productId}
// //     <h1>{product.name}</h1>

// //     </div>
// //   )
// // }

// // export default SingleProductPage
// // https://nextjs.org/docs/messages/sync-dynamic-apis
/**
 <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
<div aria-label="Breadcrumb">
          <ol role="list" className="flex items-center max-w-2xl gap-2 px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
            
            <li><Link href={''}  className="font-medium text-stone-800">Home</Link></li>
            <li className="text-stone-400">\</li>
            <li><Link href={''} className="font-medium capitalize text-stone-800">{productCategory}</Link></li>
            <li className="text-stone-400">\</li>
            <li><Link href={''} className="font-medium text-stone-500">{product.title}</Link></li>
          </ol>
        </div>
  */
