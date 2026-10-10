
"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface CategoryFilterProps {
  products: Product[];
}

export default function CategoryFilter({
  products,
}: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const uniqueCategories = new Map<
      string,
      { key: string; label: string; icon: string }
    >();

    products.forEach((product) => {
      const key = product.category;

      if (key && !uniqueCategories.has(key)) {
        uniqueCategories.set(key, {
          key,
          label: product.categoryNameBn || key,
          icon: product.categoryIcon || "🛒",
        });
      }
    });

    return Array.from(uniqueCategories.values());
  }, [products]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <section className="scroll-mt-6 py-10" id="category-filter">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          🗂️ বিভাগ অনুযায়ী পণ্য
        </h2>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          পছন্দের বিভাগ নির্বাচন করে পণ্য ও বাজারদর দেখুন।
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          aria-pressed={selectedCategory === "all"}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selectedCategory === "all"
              ? "bg-green-700 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
          }`}
        >
          সব পণ্য
        </button>

        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setSelectedCategory(category.key)}
            aria-pressed={selectedCategory === category.key}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === category.key
                ? "bg-green-700 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
            }`}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-gray-500">
        মোট {filteredProducts.length}টি পণ্য
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
          এই বিভাগে কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
}
