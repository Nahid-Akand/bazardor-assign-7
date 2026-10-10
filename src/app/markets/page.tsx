
import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import { getProducts } from "@/lib/api";
import MarketFilters, {
  type MarketRow,
} from "@/components/MarketFilters";

export default async function MarketsPage() {
  const products = await getProducts();

  const marketRows: MarketRow[] = products.flatMap((product) =>
    (product.markets ?? []).map((market, index) => ({
      key: `${product.id}-${market.market}-${market.division}-${index}`,
      productSlug: product.slug,
      productName: product.nameBn,
      categoryName: product.categoryNameBn,
      marketName: market.market,
      division: market.division,
      min: market.min,
      max: market.max,
      unit: product.unit,
    })),
  );

  const uniqueMarkets = new Set(
    marketRows.map((row) => `${row.marketName}-${row.division}`),
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft size={18} />
          হোম পেজে ফিরে যান
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <MapPin
              className="mr-2 inline text-green-700"
              size={32}
            />
            বাজারভিত্তিক দাম
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-gray-600">
            বিভিন্ন বাজারে নিত্যপ্রয়োজনীয় পণ্যের সর্বনিম্ন ও সর্বোচ্চ
            দাম তুলনা করুন।
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">মোট বাজার</p>
            <p className="mt-2 text-2xl font-bold text-green-700">
              {uniqueMarkets.size}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">মোট পণ্য</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              বাজারভিত্তিক মূল্য তথ্য
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {marketRows.length}
            </p>
          </div>
        </div>

        <MarketFilters rows={marketRows} />
      </div>
    </main>
  );
}
