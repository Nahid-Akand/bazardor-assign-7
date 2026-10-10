
import { Suspense } from "react";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import ProductSearch from "@/components/ProductSearch";
import CategoryFilter from "@/components/CategoryFilter";
import { getProducts } from "@/lib/api";
import ProductComparison from "@/components/ProductComparison";
import CheapestMarkets from "@/components/CheapestMarkets";
import PriceInsights from "@/components/PriceInsights";


export default async function HomePage() {
  const products = await getProducts();

  const risingProducts = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallingProducts = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl bg-gray-50 px-4">
      

      <Suspense
        fallback={<section className="min-h-40 bg-white" />}
      >
        <Hero />
        <PriceInsights products={products} />
        <CheapestMarkets products={products} />
      </Suspense>

      <div className="mx-auto max-w-6xl px-4">
        <ProductSearch products={products} />

        <ProductSection
          title="🔺 আজ দাম বেড়েছে"
          subtitle="যেসব পণ্যের দাম আগের তুলনায় বেড়েছে"
          products={risingProducts}
        />

        <ProductSection
          title="🔻 আজ দাম কমেছে"
          subtitle="যেসব পণ্যের দাম আগের তুলনায় কমেছে"
          products={fallingProducts}
        />

        <CategoryFilter products={products} />
        <ProductComparison products={products} />
      </div>
    </main>
  );
}
