"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPrice, toBengaliNumber } from "@/lib/utils";

interface PriceHistoryChartProps {
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
}

export default function PriceHistoryChart({
  today,
  yesterday,
  lastWeek,
  lastMonth,
}: PriceHistoryChartProps) {
  const data = [
    { period: "গত মাস", price: lastMonth },
    { period: "গত সপ্তাহ", price: lastWeek },
    { period: "গতকাল", price: yesterday },
    { period: "আজ", price: today },
  ];

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-gray-900">
          📈 দামের ইতিহাস
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          গত মাস, গত সপ্তাহ, গতকাল এবং আজকের দামের তুলনা।
        </p>
      </div>

      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 12, left: 8, bottom: 8 }}
          >
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="period"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
            />

            <YAxis
              width={65}
              tickFormatter={(value: number) =>
                toBengaliNumber(value)
              }
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />

            <Tooltip
              formatter={(value) => [
                formatPrice(Number(value)),
                "দাম",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
              labelStyle={{
                color: "#374151",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            />

            <Line
              type="monotone"
              dataKey="price"
              name="দাম"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#16a34a",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
        <p>
          সর্বনিম্ন:{" "}
          <span className="font-semibold text-green-700">
            {formatPrice(Math.min(today, yesterday, lastWeek, lastMonth))}
          </span>
        </p>

        <p>
          সর্বোচ্চ:{" "}
          <span className="font-semibold text-gray-900">
            {formatPrice(Math.max(today, yesterday, lastWeek, lastMonth))}
          </span>
        </p>
      </div>
    </section>
  );
}