import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  id?: string;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  id,
}: ProductSectionProps) {
  return (
    <section id={id} className="scroll-mt-6 py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          {subtitle}
        </p>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
          এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}