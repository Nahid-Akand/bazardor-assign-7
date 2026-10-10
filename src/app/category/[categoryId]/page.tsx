import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CategoryProductList from "@/components/CategoryProductList";
import { getCategories, getProductsByCategory } from "@/lib/api";

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { categoryId } = await params;

  let category;
  let products;

  try {
    const categories = await getCategories();

    category = categories.find(
      (item) => item.slug === categoryId || item.id === categoryId,
    );

    if (!category) {
      notFound();
    }

    products = await getProductsByCategory(category.slug);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }

    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700"
        >
          <ArrowLeft size={18} />
          হোম পেজে ফিরে যান
        </Link>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-4xl">
              {category.icon}
            </div>

            <div>
              <p className="text-sm font-medium text-green-700">
                পণ্যের বিভাগ
              </p>

              <h1 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {category.nameBn}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                এই বিভাগে {products.length}টি পণ্য পাওয়া গেছে।
              </p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              {category.icon} {category.nameBn}-এর বাজারদর
            </h2>

            <Link
              href="/"
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              সব পণ্য দেখুন →
            </Link>
          </div>

          <CategoryProductList products={products} />
        </section>
      </div>
    </main>
  );
}