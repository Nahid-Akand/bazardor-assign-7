
"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, formatUnit, formatPercent } from "@/lib/utils";

interface ProductComparisonProps {
  products: Product[];
}

export default function ProductComparison({
  products,
}: ProductComparisonProps) {
  const [firstId, setFirstId] = useState(
    products[0] ? String(products[0].id) : ""
  );

  const [secondId, setSecondId] = useState(
    products[1] ? String(products[1].id) : ""
  );

  const firstProduct = products.find(
    (product) => String(product.id) === firstId
  );

  const secondProduct = products.find(
    (product) => String(product.id) === secondId
  );

  const priceRows = [
    { label: "আজকের দাম", key: "today" as const },
    { label: "গতকালের দাম", key: "yesterday" as const },
    { label: "গত সপ্তাহের দাম", key: "lastWeek" as const },
    { label: "গত মাসের দাম", key: "lastMonth" as const },
  ];

  return (
    <section
      id="product-comparison"
      className="scroll-mt-6 py-10"
    >
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          <ArrowLeftRight className="text-green-700" />
          পণ্যের দাম তুলনা
        </h2>

        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          দুটি পণ্যের বর্তমান ও আগের দাম পাশাপাশি তুলনা করুন।
        </p>
      </div>

      {products.length < 2 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
          তুলনা করার জন্য অন্তত দুটি পণ্যের তথ্য প্রয়োজন।
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="compare-product-one"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                প্রথম পণ্য
              </label>

              <select
                id="compare-product-one"
                value={firstId}
                onChange={(event) => setFirstId(event.target.value)}
                className="select w-full rounded-xl border border-gray-200 bg-white"
              >
                {products.map((product) => (
                  <option key={product.id} value={String(product.id)}>
                    {product.nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="compare-product-two"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                দ্বিতীয় পণ্য
              </label>

              <select
                id="compare-product-two"
                value={secondId}
                onChange={(event) => setSecondId(event.target.value)}
                className="select w-full rounded-xl border border-gray-200 bg-white"
              >
                {products.map((product) => (
                  <option key={product.id} value={String(product.id)}>
                    {product.nameBn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {firstProduct && secondProduct && (
            <>
              {firstProduct.id === secondProduct.id && (
                <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  অর্থপূর্ণ তুলনার জন্য দুটি আলাদা পণ্য নির্বাচন করুন।
                </p>
              )}

              <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-4 font-semibold">
                        বিবরণ
                      </th>
                      <th className="px-4 py-4 font-semibold">
                        {firstProduct.nameBn}
                      </th>
                      <th className="px-4 py-4 font-semibold">
                        {secondProduct.nameBn}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-4 text-gray-600">
                        একক
                      </td>
                      <td className="px-4 py-4">
                        {formatUnit(firstProduct.unit)}
                      </td>
                      <td className="px-4 py-4">
                        {formatUnit(secondProduct.unit)}
                      </td>
                    </tr>

                    {priceRows.map((row) => (
                      <tr key={row.key}>
                        <td className="px-4 py-4 text-gray-600">
                          {row.label}
                        </td>

                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {formatPrice(firstProduct[row.key])}
                        </td>

                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {formatPrice(secondProduct[row.key])}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td className="px-4 py-4 text-gray-600">
                        দামের পরিবর্তন
                      </td>

                      <td
                        className={`px-4 py-4 font-semibold ${
                          firstProduct.change.dir === "up"
                            ? "text-red-600"
                            : firstProduct.change.dir === "down"
                              ? "text-green-700"
                              : "text-gray-600"
                        }`}
                      >
                        {firstProduct.change.dir === "up"
                          ? "↑ "
                          : firstProduct.change.dir === "down"
                            ? "↓ "
                            : ""}
                        {formatPercent(firstProduct.change.pct)}
                      </td>

                      <td
                        className={`px-4 py-4 font-semibold ${
                          secondProduct.change.dir === "up"
                            ? "text-red-600"
                            : secondProduct.change.dir === "down"
                              ? "text-green-700"
                              : "text-gray-600"
                        }`}
                      >
                        {secondProduct.change.dir === "up"
                          ? "↑ "
                          : secondProduct.change.dir === "down"
                            ? "↓ "
                            : ""}
                        {formatPercent(secondProduct.change.pct)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                দ্রষ্টব্য: প্রতিটি পণ্যের একক আলাদা হতে পারে। তাই দাম তুলনার
                সময় এককও বিবেচনা করুন।
              </p>
            </>
          )}
        </>
      )}
    </section>
  );
}
