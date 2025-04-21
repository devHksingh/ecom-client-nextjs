import ProductPagination from "@/components/ProductPagination";

export default async function CategoryProductPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const initialSkip = 0;
  const limit = 12;

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
    <div>
      {/* <h1 className="text-2xl font-bold">Products</h1> */}
      <ProductPagination
        initialProducts={apiData.products}
        initialSkip={initialSkip}
        limit={limit}
        total={apiData.total}
        totalPage={apiData.totalPages}
        currentPage={apiData.currentPage}
        prevPage={apiData.prevPage}
        nextPage={apiData.nextPage}
        category={category}
      />
    </div>
  );
}
