
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, X } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, formatUnit } from "@/lib/utils";

const STORAGE_KEY = "bazardor-recently-viewed";
const MAX_ITEMS = 6;

interface RecentlyViewedProps {
  products: Product[];
}

export function recordRecentlyViewed(productId: number) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const previous: number[] = stored ? JSON.parse(stored) : [];

    const updated = [
      productId,
      ...previous.filter((id) => id !== productId),
    ].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("bazardor-recently-viewed"));
  } catch {
    // Continue normally if browser storage is unavailable.
  }
}

export default function RecentlyViewed({
  products,
}: RecentlyViewedProps) {
  const [viewedIds, setViewedIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function loadViewed() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed: unknown = stored ? JSON.parse(stored) : [];

        setViewedIds(
          Array.isArray(parsed)
            ? parsed.filter(
                (id): id is number =>
                  typeof id === "number" && Number.isFinite(id),
              )
            : [],
        );
      } catch {
        setViewedIds([]);
      }
    }

    loadViewed();
    setReady(true);

    window.addEventListener("bazardor-recently-viewed", loadViewed);
    window.addEventListener("storage", loadViewed);

    return () => {
      window.removeEventListener(
        "bazardor-recently-viewed",
        loadViewed,
      );
      window.removeEventListener("storage", loadViewed);
    };
  }, []);

  const viewedProducts = viewedIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => product !== undefined);

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore unavailable browser storage.
    }

    setViewedIds([]);
  }

  if (!ready || viewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-gray-900 sm:text-2xl">
            <Clock3 size={23} className="text-green-700" />
            সম্প্রতি দেখা পণ্য
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            আপনার আগে দেখা পণ্যগুলো এখানে পাবেন।
          </p>
        </div>

        <button
          type="button"
          onClick={clearHistory}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-red-600"
        >
          <X size={16} />
          ইতিহাস মুছুন
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {viewedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-green-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {product.categoryIcon || "🛒"}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-gray-900">
                  {product.nameBn}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {product.categoryNameBn}
                </p>
                <p className="mt-2 font-bold text-green-700">
                  {formatPrice(product.today)}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    / {formatUnit(product.unit)}
                  </span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
