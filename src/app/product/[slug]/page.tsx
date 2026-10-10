
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import RecordProductView from "@/components/RecordProductView";
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  MapPin,
} from "lucide-react";

import { getProduct, getProducts } from "@/lib/api";
import {
  formatPrice,
  formatUnit,
  formatPercent,
} from "@/lib/utils";
import PriceHistoryChart from "@/components/PriceHistoryChart";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

async function ProductContent({ slug }: { slug: string }) {
  const products = await getProducts();

  const matchedProduct = products.find(
    (item) => item.slug === slug
  );

  if (!matchedProduct) {
    notFound();
  }

  const product = await getProduct(String(matchedProduct.id));

  if (!product) {
    notFound();
  }

  const markets = [...(product.markets ?? [])].sort(
    (a, b) => a.min - b.min
  );

  const lowestPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : null;

  const highestPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : null;

  const changeIsUp = product.change.dir === "up";
  const changeIsDown = product.change.dir === "down";

  const ChangeIcon = changeIsUp
    ? ArrowUpRight
    : changeIsDown
      ? ArrowDownRight
      : Minus;

  const changeColor = changeIsUp
    ? "text-red-600"
    : changeIsDown
      ? "text-green-600"
      : "text-gray-500";

  const historicalPrices = [
    {
      label: "আজকের দাম",
      value: product.today,
    },
    {
      label: "গতকালের দাম",
      value: product.yesterday,
    },
    {
      label: "গত সপ্তাহের দাম",
      value: product.lastWeek,
    },
    {
      label: "গত মাসের দাম",
      value: product.lastMonth,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <RecordProductView productId={product.id} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft size={18} />
          হোম পেজে ফিরে যান
        </Link>

        {/* Product information */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 md:grid-cols-2">
            {/* Product image */}
            <div className="flex min-h-64 items-center justify-center rounded-xl bg-gray-50 p-6">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.nameBn}
                  className="max-h-72 w-full object-contain"
                />
              ) : (
                <span className="text-7xl">
                  {product.categoryIcon || "🛒"}
                </span>
              )}
            </div>

            {/* Product details */}
            <div className="flex flex-col justify-center">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {product.categoryIcon} {product.categoryNameBn}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                  {formatUnit(product.unit)}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {product.nameBn}
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                বাজারভেদে পণ্যের দাম তুলনা করুন
              </p>

              {/* Today's price */}
              <div className="mt-6 rounded-xl bg-green-50 p-5">
                <p className="text-sm font-medium text-gray-600">
                  আজকের দাম
                </p>

                <p className="mt-1 text-3xl font-bold text-green-700">
                  {formatPrice(product.today)}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    / {formatUnit(product.unit)}
                  </span>
                </p>

                <div
                  className={`mt-3 flex items-center gap-1 text-sm font-semibold ${changeColor}`}
                >
                  <ChangeIcon size={19} />
                  {formatPercent(product.change.pct)}

                  <span className="font-normal text-gray-600">
                    {changeIsUp
                      ? "গতকালের তুলনায় দাম বেড়েছে"
                      : changeIsDown
                        ? "গতকালের তুলনায় দাম কমেছে"
                        : "গতকালের তুলনায় দাম অপরিবর্তিত"}
                  </span>
                </div>
              </div>

              {/* Market price summary */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">
                    সর্বনিম্ন বাজারদর
                  </p>

                  <p className="mt-2 text-xl font-bold text-green-700">
                    {lowestPrice !== null
                      ? formatPrice(lowestPrice)
                      : "তথ্য নেই"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">
                    সর্বোচ্চ বাজারদর
                  </p>

                  <p className="mt-2 text-xl font-bold text-red-600">
                    {highestPrice !== null
                      ? formatPrice(highestPrice)
                      : "তথ্য নেই"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Historical price comparison */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              ঐতিহাসিক মূল্য তুলনা
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              বিভিন্ন সময়ের পণ্যের দাম এক নজরে দেখুন।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {historicalPrices.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {formatPrice(item.value)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  প্রতি {formatUnit(product.unit)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Price history chart */}
        <PriceHistoryChart
          today={product.today}
          yesterday={product.yesterday}
          lastWeek={product.lastWeek}
          lastMonth={product.lastMonth}
        />

        {/* Market-wise prices */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              বাজারভিত্তিক দাম
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              বিভিন্ন বাজারে এই পণ্যের সর্বনিম্ন ও সর্বোচ্চ দাম।
            </p>
          </div>

          {markets.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        বাজারের নাম
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        বিভাগ
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        সর্বনিম্ন দাম
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        সর্বোচ্চ দাম
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {markets.map((market, index) => (
                      <tr
                        key={`${market.market}-${market.division}-${index}`}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">
                          <span className="flex items-center gap-2">
                            <MapPin
                              size={16}
                              className="shrink-0 text-green-700"
                            />
                            {market.market}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {market.division}
                        </td>

                        <td className="px-5 py-4 font-semibold text-green-700">
                          {formatPrice(market.min)}
                        </td>

                        <td className="px-5 py-4 font-semibold text-red-600">
                          {formatPrice(market.max)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
            </div>
          )}
        </section>

        {/* Return to products */}
        <div className="flex justify-center mt-8">
  <Link
    href="/"
    className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
  >
    সব পণ্য দেখুন
  </Link>
</div>
      </div>
    </main>
  );
}

export default function ProductPage({
  params,
}: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-4 py-10">
          <div className="mx-auto max-w-7xl animate-pulse space-y-5">
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="h-72 rounded-2xl bg-white" />
            <div className="h-40 rounded-2xl bg-white" />
          </div>
        </main>
      }
    >
      <ProductPageContent params={params} />
    </Suspense>
  );
}

async function ProductPageContent({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  return <ProductContent slug={slug} />;
}
