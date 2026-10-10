
import Link from "next/link";
import { MapPin, TrendingDown } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, formatUnit } from "@/lib/utils";

interface CheapestMarketsProps {
  products: Product[];
}

export default function CheapestMarkets({
  products,
}: CheapestMarketsProps) {
  const cheapestProducts = products
    .map((product) => {
      const markets = (product.markets ?? [])
        .filter(
          (market) =>
            Number.isFinite(market.min) && market.min > 0,
        )
        .sort((a, b) => a.min - b.min);

      if (markets.length === 0) {
        return null;
      }

      return {
        ...product,
        cheapestMarket: markets[0],
      };
    })
    .filter((item) => item !== null)
    .sort((a, b) => a.cheapestMarket.min - b.cheapestMarket.min);

  if (cheapestProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          <TrendingDown className="text-green-700" size={30} />
          সবচেয়ে কম দামের বাজার
        </h2>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          প্রতিটি পণ্যের জন্য বাজারের রেকর্ড করা সর্বনিম্ন দাম দেখুন।
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cheapestProducts.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {product.categoryIcon || "🛒"}
                </span>

                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900">
                    {product.nameBn}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {product.categoryNameBn}
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                কম দাম
              </span>
            </div>

            <div className="mt-5 rounded-xl bg-green-50 p-4">
              <p className="text-sm text-gray-600">সর্বনিম্ন বাজারদর</p>

              <p className="mt-1 text-2xl font-extrabold text-green-700">
                {formatPrice(product.cheapestMarket.min)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                প্রতি {formatUnit(product.unit)}
              </p>
            </div>

            <div className="mt-4 flex items-start gap-2 text-sm text-gray-700">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-green-700"
              />

              <div>
                <p className="font-semibold">
                  {product.cheapestMarket.market}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {product.cheapestMarket.division}
                </p>
              </div>
            </div>

            <Link
              href={`/product/${product.slug}`}
              className="btn btn-outline btn-success btn-sm mt-5 w-full"
            >
              পণ্যের বিস্তারিত দেখুন
            </Link>
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-500">
        দ্রষ্টব্য: সর্বনিম্ন দাম API-তে থাকা বাজারের তথ্য থেকে নির্ধারিত।
        এটি সব বাজারের বর্তমান দাম নিশ্চিত করে না।
      </p>
    </section>
  );
}
