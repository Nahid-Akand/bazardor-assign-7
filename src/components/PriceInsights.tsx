
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, formatPercent } from "@/lib/utils";

interface PriceInsightsProps {
  products: Product[];
}

export default function PriceInsights({
  products,
}: PriceInsightsProps) {
  const rising = products
    .filter(
      (product) =>
        product.change.dir === "up" &&
        Number.isFinite(product.change.pct),
    )
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 5);

  const falling = products
    .filter(
      (product) =>
        product.change.dir === "down" &&
        Number.isFinite(product.change.pct),
    )
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 5);

  return (
    <section className="py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          📊 বাজারদরের গুরুত্বপূর্ণ পরিবর্তন
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে বা কমেছে।
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InsightCard
          title="সবচেয়ে বেশি দাম বেড়েছে"
          subtitle="দাম বৃদ্ধির শতকরা হার অনুযায়ী"
          products={rising}
          direction="up"
        />

        <InsightCard
          title="সবচেয়ে বেশি দাম কমেছে"
          subtitle="দাম হ্রাসের শতকরা হার অনুযায়ী"
          products={falling}
          direction="down"
        />
      </div>
    </section>
  );
}

interface InsightCardProps {
  title: string;
  subtitle: string;
  products: Product[];
  direction: "up" | "down";
}

function InsightCard({
  title,
  subtitle,
  products,
  direction,
}: InsightCardProps) {
  const isUp = direction === "up";
  const Icon = isUp ? TrendingUp : TrendingDown;
  const ChangeIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className={`border-b p-5 ${
          isUp
            ? "border-red-100 bg-red-50"
            : "border-green-100 bg-green-50"
        }`}
      >
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Icon
            size={22}
            className={isUp ? "text-red-600" : "text-green-700"}
          />
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      </div>

      {products.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="flex items-center justify-between gap-3 p-4 transition hover:bg-gray-50 sm:p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {product.nameBn}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    বর্তমান দাম: {formatPrice(product.today)}
                  </p>
                </div>
              </div>

              <span
                className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-bold ${
                  isUp
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <ChangeIcon size={16} />
                {formatPercent(Math.abs(product.change.pct))}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="p-6 text-sm text-gray-500">
          এই মুহূর্তে পর্যাপ্ত মূল্য পরিবর্তনের তথ্য নেই।
        </p>
      )}
    </div>
  );
}
