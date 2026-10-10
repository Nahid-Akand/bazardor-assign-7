"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface CategoryProductListProps {
  products: Product[];
}

type SortOption = "default" | "low-to-high" | "high-to-low";

export default function CategoryProductList({
  products,
}: CategoryProductListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sortBy]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          মোট {sortedProducts.length}টি পণ্য
        </p>

        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <span className="shrink-0">দাম অনুযায়ী সাজান</span>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="select select-bordered w-full bg-white sm:w-56"
          >
            <option value="default">ডিফল্ট ক্রম</option>
            <option value="low-to-high">কম দাম থেকে বেশি</option>
            <option value="high-to-low">বেশি দাম থেকে কম</option>
          </select>
        </label>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">
            এই বিভাগে বর্তমানে কোনো পণ্যের তথ্য পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}