import ProductPagination from "@/components/ProductPagination";
import Link from "next/link";

export default async function CategoryProductPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const initialSkip = 0;
  const limit = 12;
  if (category) {
    console.log("search category: ", category);
  }

  const data = {
    limit: 12,
    skip: 0,
    category: [`${category}`],
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
        revalidate: 3600, //caching
      },
    }
  );
  let apiData;
  if (response.ok) {
    apiData = await response.json();
  }
  if (apiData) {
    console.log("apidata", apiData);
  }
  return (
    <div className=" container">
      <div className="mt-8" aria-label="Breadcrumb">
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
              href={`/category/${category}`}
              className="font-medium capitalize text-stone-500 hover:cursor-pointer"
            >
              {category}
            </Link>
          </li>
        </ol>
      </div>
      <ProductPagination
        initialProducts={apiData.products}
        initialSkip={initialSkip}
        limit={limit}
        total={apiData.total}
        totalPage={apiData.totalPages}
        currentPage={apiData.currentPage}
        // prevPage={apiData.prevPage}
        // nextPage={apiData.nextPage}
        category={category}
      />
    </div>
  );
}
