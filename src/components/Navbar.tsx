
import Link from "next/link";
import { connection } from "next/server";
import { getCategories } from "@/lib/api";
import PriceTicker from "./PriceTicker";
import AuthNav from "./AuthNav";

export default async function Navbar() {
  await connection();

  const categories = await getCategories();

  const date = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>

            <span>
              <span className="block text-2xl font-extrabold text-primary">
                বাজার দর
              </span>

              <span className="text-xs text-base-content/60">
                {date}
              </span>
            </span>
          </Link>

          <AuthNav />
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-3">
          <Link
            href="/"
            className="btn btn-primary btn-sm shrink-0"
          >
            সব পণ্য
          </Link>

          <Link
            href="/markets"
            className="btn btn-ghost btn-sm shrink-0"
          >
            🏪 বাজারসমূহ
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="btn btn-ghost btn-sm shrink-0"
            >
              {category.icon} {category.nameBn}
            </Link>
          ))}
        </nav>
      </div>

      <PriceTicker />
    </header>
  );
}
