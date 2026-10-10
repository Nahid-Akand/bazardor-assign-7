
import { getProducts } from "@/lib/api";
import { formatPrice, formatUnit, formatPercent } from "@/lib/utils";

export default async function PriceTicker() {
  const products = await getProducts();

  const items = products.slice(0, 12);

  return (
    <div className="overflow-hidden border-t border-base-300 bg-base-200 py-2">
      <div className="ticker-track flex w-max items-center gap-8">
        {[...items, ...items].map((product, index) => (
          <span
            key={`${product.id}-${index}`}
            className="flex shrink-0 items-center gap-2 text-sm"
          >
            <span>{product.image}</span>
            <span className="font-semibold">{product.nameBn}</span>
            <span>{formatPrice(product.today)}</span>
            <span className="text-base-content/60">
              {formatUnit(product.unit)}
            </span>
            <span
              className={
                product.change.dir === "up"
                  ? "font-semibold text-green-600"
                  : product.change.dir === "down"
                    ? "font-semibold text-red-600"
                    : "text-gray-500"
              }
            >
              {product.change.dir === "up"
                ? "▲"
                : product.change.dir === "down"
                  ? "▼"
                  : "—"}{" "}
              {formatPercent(product.change.pct)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
