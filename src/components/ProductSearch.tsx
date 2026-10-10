
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { formatPrice, formatUnit } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductSearchProps {
  products: Product[];
}

export default function ProductSearch({
  products,
}: ProductSearchProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) return [];

    return products
      .filter((product) =>
        [
          product.nameBn,
          product.categoryNameBn,
          product.category,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLocaleLowerCase()
              .includes(normalizedQuery)
          )
      )
      .slice(0, 8);
  }, [products, query]);

  return (
    <section className="py-6">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="পণ্যের নাম লিখে খুঁজুন..."
          aria-label="পণ্য খুঁজুন"
          className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="অনুসন্ধান মুছুন"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {query.trim() && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {filteredProducts.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex items-center justify-between gap-4 p-4 transition hover:bg-green-50"
                    onClick={() => setQuery("")}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {product.categoryIcon} {product.nameBn}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.categoryNameBn}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-bold text-green-700">
                        {formatPrice(product.today)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        প্রতি {formatUnit(product.unit)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-5 text-center text-sm text-gray-500">
              দুঃখিত, এই নামে কোনো পণ্য পাওয়া যায়নি।
            </p>
          )}
        </div>
      )}
    </section>
  );
}
