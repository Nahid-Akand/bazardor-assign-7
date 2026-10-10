import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowDown } from "lucide-react";

export default async function Hero() {
  await connection();

  const today = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <section className="bg-white">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
        {/* Hero Content */}
        <div className="order-2 space-y-6 lg:order-1">
          <p className="text-sm font-medium text-gray-500">
            📅 {today}
          </p>

          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="/#সব-পণ্য"
            className="btn border-0 bg-green-600 text-white shadow-md hover:bg-green-700"
          >
            সব পণ্য দেখুন
            <ArrowDown size={18} />
          </Link>
        </div>

        {/* Hero Image */}
        <div className="order-1 lg:order-2">
          <Image
            src="/bazar-hero.png"
            alt="বাজার দর — নিত্যপ্রয়োজনীয় পণ্য"
            width={640}
            height={520}
            priority
            className="mx-auto h-auto w-full max-w-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}