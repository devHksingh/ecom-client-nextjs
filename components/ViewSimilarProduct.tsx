import { ProductProps } from "@/types/product";
import React from "react";
import ListOfProduct from "./ListOfProduct";
import { Button } from "./ui/button";
import Link from "next/link";

interface ViewSimilarProductProps {
  products: ProductProps[];
  headTtitle: string;
  total: number;
  category:string[]
}

const ViewSimilarProduct = ({
  products,
  headTtitle,
  total,
  category
}: ViewSimilarProductProps) => {
    let productCategory: string = "";
    if (category) {
        const categories = category;
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
  return (
    <div className="relative container">
      <ListOfProduct headTtitle={headTtitle} products={products} />
      {total > 8 && (
        <div className=" absolute bottom-14 lg:bottom-10 lg:right-28 right-12">
            {/* TODO: ADD Similar category link */}
          <Button variant={'ghost'}><Link href={`/category/${productCategory}`} >View More</Link></Button>
        </div>
      )}
    </div>
  );
};

export default ViewSimilarProduct;
