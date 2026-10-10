
import { getCategories, getProducts } from "@/lib/api";

export default async function TestApiPage() {
  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);

    return (
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <h1 className="text-3xl font-bold">BazarDor API Test</h1>

        <p>Categories found: {categories.length}</p>
        <p>Products found: {products.length}</p>

        <h2 className="text-xl font-semibold">Categories</h2>
        <ul className="list-inside list-disc">
          {categories.map((category) => (
            <li key={category.id}>
              {category.icon} {category.nameBn}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold">First product</h2>
        <pre className="overflow-auto rounded-lg bg-base-200 p-4 text-sm">
          {JSON.stringify(products[0], null, 2)}
        </pre>
      </main>
    );
  } catch {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold">API connection failed</h1>
        <p>Please check the API URLs and try again.</p>
      </main>
    );
  }
}
