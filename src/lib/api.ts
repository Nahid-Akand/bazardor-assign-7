
import type { Category, Product } from "@/types/product";

const API_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
];

async function fetchFromApi<T>(path: string): Promise<T> {
  let lastError: unknown;

  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Both BazarDor APIs are unavailable.");
}

export async function getCategories(): Promise<Category[]> {
  return fetchFromApi<Category[]>("/categories");
}

export async function getProducts(): Promise<Product[]> {
  return fetchFromApi<Product[]>("/products");
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  return fetchFromApi<Product[]>(
    `/products?category=${encodeURIComponent(category)}`,
  );
}

export async function getProduct(
  id: string,
): Promise<Product> {
  return fetchFromApi<Product>(`/products/${encodeURIComponent(id)}`);
}

export async function getCategory(
  slug: string,
): Promise<Category> {
  return fetchFromApi<Category>(
    `/categories/${encodeURIComponent(slug)}`,
  );
}
