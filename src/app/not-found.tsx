import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-50 text-green-700">
          <SearchX size={40} strokeWidth={1.8} />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-green-700">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          পৃষ্ঠা খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mt-4 text-base leading-7 text-gray-600">
          দুঃখিত! আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে, অথবা ঠিকানাটি
          ভুল হতে পারে।
        </p>

        <Link
          href="/"
          className="btn mt-8 border-0 bg-green-600 text-white hover:bg-green-700"
        >
          <ArrowLeft size={18} />
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}