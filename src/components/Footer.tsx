import Link from "next/link";
import { connection } from "next/server";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types/product";

export default async function Footer() {
  await connection();

  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load footer categories:", error);
  }

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🛒
              </span>
              <span className="text-2xl font-extrabold text-green-700">
                বাজার দর
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-600">
              বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর জানুন।
              বিভিন্ন বাজারের দামের তুলনা করুন সহজেই।
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-base font-bold text-gray-900">
              দ্রুত লিংক
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-green-700">
                  হোম পেজ
                </Link>
              </li>
              <li>
                <Link href="/#সব-পণ্য" className="hover:text-green-700">
                  সব পণ্য দেখুন
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-green-700">
                  সাইন ইন
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-green-700">
                  সাইন আপ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-base font-bold text-gray-900">
              পণ্যের বিভাগ
            </h2>

            {categories.length > 0 ? (
              <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="hover:text-green-700"
                    >
                      {category.icon} {category.nameBn}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                বিভাগগুলো বর্তমানে লোড করা যাচ্ছে না।
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>© {year} বাজার দর — সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="mt-2">
            বাজারের দামের তথ্য পরিবর্তনশীল; কেনাকাটার আগে যাচাই করুন।
          </p>
        </div>
      </div>
    </footer>
  );
}