import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, formatUnit, formatPercent } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const changeColor =
    product.change.dir === "up"
      ? "text-red-600 bg-red-50"
      : product.change.dir === "down"
        ? "text-green-700 bg-green-50"
        : "text-gray-500 bg-gray-100";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
          {product.image || product.categoryIcon}
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${changeColor}`}
        >
          {product.change.dir === "up" ? (
            <ArrowUpRight size={14} />
          ) : product.change.dir === "down" ? (
            <ArrowDownRight size={14} />
          ) : (
            <Minus size={14} />
          )}
          {formatPercent(product.change.pct)}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900 transition group-hover:text-green-700">
        {product.nameBn}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {product.categoryIcon} {product.categoryNameBn} ·{" "}
        {formatUnit(product.unit)}
      </p>

      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-xl font-extrabold text-gray-900">
            {formatPrice(product.today)}
          </p>
        </div>

        <span className="text-sm font-medium text-green-700 group-hover:underline">
          বিস্তারিত →
        </span>
      </div>
    </Link>
  );
}