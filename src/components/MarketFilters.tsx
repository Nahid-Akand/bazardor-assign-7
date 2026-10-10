
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, MapPin, ArrowUpDown } from "lucide-react";
import { formatPrice, formatUnit } from "@/lib/utils";

export interface MarketRow {
  key: string;
  productSlug: string;
  productName: string;
  categoryName: string;
  marketName: string;
  division: string;
  min: number;
  max: number;
  unit: string;
}

interface MarketFiltersProps {
  rows: MarketRow[];
}

export default function MarketFilters({ rows }: MarketFiltersProps) {
  const [query, setQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [sortBy, setSortBy] = useState("min-asc");

  const divisions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((row) => row.division).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "bn")),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    const filtered = rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          row.productName,
          row.categoryName,
          row.marketName,
          row.division,
        ].some((value) =>
          value.toLocaleLowerCase().includes(normalizedQuery),
        );

      const matchesDivision =
        selectedDivision === "all" ||
        row.division === selectedDivision;

      return matchesQuery && matchesDivision;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "min-desc":
          return b.min - a.min;

        case "max-asc":
          return a.max - b.max;

        case "max-desc":
          return b.max - a.max;

        case "market":
          return a.marketName.localeCompare(b.marketName, "bn");

        case "product":
          return a.productName.localeCompare(b.productName, "bn");

        case "min-asc":
        default:
          return a.min - b.min;
      }
    });
  }, [rows, query, selectedDivision, sortBy]);

  function resetFilters() {
    setQuery("");
    setSelectedDivision("all");
    setSortBy("min-asc");
  }

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition focus-within:border-green-500">
          <Search size={20} className="shrink-0 text-gray-400" />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="পণ্য বা বাজারের নাম লিখুন..."
            aria-label="পণ্য বা বাজার খুঁজুন"
            className="w-full min-w-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="অনুসন্ধান মুছুন"
              className="shrink-0 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </label>

        <select
          value={selectedDivision}
          onChange={(event) => setSelectedDivision(event.target.value)}
          aria-label="বিভাগ অনুযায়ী ফিল্টার"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-green-500"
        >
          <option value="all">সব বিভাগ</option>

          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>

        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3">
          <ArrowUpDown
            size={18}
            className="shrink-0 text-green-700"
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="দামের তালিকা সাজান"
            className="w-full min-w-0 bg-transparent py-3 text-sm text-gray-700 outline-none"
          >
            <option value="min-asc">
              সর্বনিম্ন দাম: কম থেকে বেশি
            </option>
            <option value="min-desc">
              সর্বনিম্ন দাম: বেশি থেকে কম
            </option>
            <option value="max-asc">
              সর্বোচ্চ দাম: কম থেকে বেশি
            </option>
            <option value="max-desc">
              সর্বোচ্চ দাম: বেশি থেকে কম
            </option>
            <option value="market">বাজারের নাম অনুযায়ী</option>
            <option value="product">পণ্যের নাম অনুযায়ী</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          মোট{" "}
          <span className="font-semibold text-gray-900">
            {filteredRows.length}
          </span>{" "}
          টি মূল্য তথ্য পাওয়া গেছে
        </p>

        {(query || selectedDivision !== "all" || sortBy !== "min-asc") && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 transition hover:text-green-900"
          >
            <X size={16} />
            সব ফিল্টার রিসেট
          </button>
        )}
      </div>

      {filteredRows.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">বাজার</th>
                <th className="px-5 py-4 font-semibold">বিভাগ</th>
                <th className="px-5 py-4 font-semibold">পণ্য</th>
                <th className="px-5 py-4 font-semibold">
                  সর্বনিম্ন দাম
                </th>
                <th className="px-5 py-4 font-semibold">
                  সর্বোচ্চ দাম
                </th>
                <th className="px-5 py-4 font-semibold">বিস্তারিত</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRows.map((row) => (
                <tr
                  key={row.key}
                  className="transition hover:bg-green-50/50"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    <span className="flex items-center gap-2">
                      <MapPin
                        size={16}
                        className="shrink-0 text-green-700"
                      />
                      {row.marketName}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {row.division}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {row.productName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {row.categoryName}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-semibold text-green-700">
                    {formatPrice(row.min)}
                    <span className="mt-1 block text-xs font-normal text-gray-500">
                      প্রতি {formatUnit(row.unit)}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold text-red-600">
                    {formatPrice(row.max)}
                    <span className="mt-1 block text-xs font-normal text-gray-500">
                      প্রতি {formatUnit(row.unit)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/product/${row.productSlug}`}
                      className="font-semibold text-green-700 hover:underline"
                    >
                      দেখুন
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <Search
            className="mx-auto mb-3 text-gray-400"
            size={28}
          />

          <p className="font-semibold text-gray-800">
            কোনো মূল্য তথ্য পাওয়া যায়নি
          </p>

          <p className="mt-2 text-sm text-gray-500">
            অন্য নাম লিখুন অথবা বিভাগ পরিবর্তন করুন।
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-primary btn-sm mt-4"
          >
            সব ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </>
  );
}
