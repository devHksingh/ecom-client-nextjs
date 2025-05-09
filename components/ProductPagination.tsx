"use client";
import { fetchProductByCategoryWithLimit } from "@/http/api";
import { ProductProps } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ListOfProduct from "./ListOfProduct";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  initialProducts: ProductProps[];
  category: string;
  initialSkip: number;
  limit: number;
  total: number;
  totalPage: number;
  currentPage: number;
  // prevPage: number;
  // nextPage: number;
}

const ProductPagination = ({
  initialProducts,
  initialSkip,
  limit,
  total,
  totalPage,
  currentPage,
  // prevPage,
  // nextPage,
  category,
}: ProductPaginationProps) => {
  const [products, setProducts] = useState(initialProducts);
  const [pageLimit, setPageLimit] = useState<number>(limit);
  const [totalProducts, setTotalProducts] = useState<number>(total);
  const [pageSkip, setPageSkip] = useState<number>(initialSkip);
  const [pageCount, setPageCount] = useState<number>(totalPage);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(currentPage);
  //   const [prevPageIndex, setPrevPageIndex] = useState<number | null>(prevPage);
  //   const [nextPageIndex, setNextPageIndex] = useState<number | null>(nextPage);
  const [productCategory, ] = useState<string>(category);

  

  // Fetch products data
  // isError, error
  const { data, isLoading,  } = useQuery({
    queryKey: ["Category", pageLimit, pageSkip, productCategory],
    queryFn: () =>
      fetchProductByCategoryWithLimit({
        limit: pageLimit,
        skip: pageSkip,
        category: [productCategory],
      }),
    staleTime: 40 * (60 * 1000),
    gcTime: 40 * (60 * 1000),
    refetchIntervalInBackground: true,
  });
  //   useEffect(() => {
  //     if (data) {
  //       console.log("cate data", data);
  //       console.log("cate data products", data.data.products);
  //       setProducts(data.data.products);
  //       setTotalProducts(data.data.total);
  //       setPageLimit(data.data.limit);
  //       setPageCount(data.data.totalPages);
  //       setCurrentPageIndex(data.data.currentPage);
  //       setPrevPageIndex(data.data.prevPage);
  //       setNextPageIndex(data.data.nextPage);

  //       // skip?
  //     }
  //   }, [data]);
  useEffect(() => {
    if (data?.data?.products) {
      setProducts(data.data.products);
      setTotalProducts(data.data.total);
      setCurrentPageIndex(data.data.currentPage);
      setPageCount(data.data.totalPages);
      setPageLimit(data.data.limit);
    }
  }, [data]);

  //   const handlePrevBtn = () => {
  //     setPageSkip((prev) => prev - pageLimit);
  //   };
  //   const handleNextBtn = () => {
  //     setPageSkip((prev) => prev + pageLimit);
  //   };
  const handlePrevBtn = () => {
    if (currentPageIndex > 1) {
      setPageSkip((prev) => prev - pageLimit);
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleNextBtn = () => {
    if (currentPageIndex < pageCount) {
      setPageSkip((prev) => prev + pageLimit);
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="container relative ">
      <ListOfProduct products={products} headTtitle={category} />

      <div className="absolute  lg:bottom-8 right-1/2 translate-x-1/2 w-full lg:w-1/2 ">
        <div className="flex  justify-between items-center gap-4 mb-8">
          <span className="text-copy-primary/90">
            Total products {totalProducts}
          </span>
          <div className="flex gap-4 items-center">
            <button
              onClick={handlePrevBtn}
              disabled={currentPageIndex === 1 || isLoading}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-copy-primary/90">
              {currentPageIndex} of {pageCount}
            </span>
            <button
              onClick={handleNextBtn}
              disabled={currentPageIndex === pageCount || isLoading}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPagination;
/*
<div className=" container  relative">
      {products.length > 0 ? (
        <ListOfProduct products={products} headTtitle={category} />
      ) : (
        <ListOfProduct products={initialProducts} headTtitle={category} />
      )}
      <div className="absolute bottom-8 right-1/2 translate-x-1/2">
        <div className="flex justify-between items-center gap-4 ">
          <span className="text-copy-primary/90">
            Total products {totalProducts}
          </span>
          <div className="flex justify-around items-center gap-4 ">
            <button
              onClick={handlePrevBtn}
              disabled={currentPageIndex === 1 || isLoading}
              aria-label="Previous Page Button"
              className="p-2 text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 hover:cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="ml-1 text-copy-primary/90">
              {currentPageIndex} of {pageCount}
            </span>
            <button
              onClick={handleNextBtn}
              disabled={currentPageIndex === pageCount || isLoading}
              aria-label="Next Page Button"
              className="p-2 text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 hover:cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>

*/
