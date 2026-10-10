export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Back link */}
        <div className="mb-6 h-5 w-40 rounded bg-gray-200" />

        {/* Category header */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="size-16 shrink-0 rounded-2xl bg-gray-200" />

            <div className="flex-1 space-y-3">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-8 w-40 rounded bg-gray-200" />
              <div className="h-4 w-56 max-w-full rounded bg-gray-200" />
            </div>
          </div>
        </section>

        {/* Product heading and sorting */}
        <section className="py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="h-7 w-48 rounded bg-gray-200" />
            <div className="h-10 w-56 max-w-full rounded-lg bg-gray-200" />
          </div>

          {/* Product card skeletons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="size-14 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 max-w-full rounded bg-gray-200" />
                    <div className="h-4 w-20 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="mb-3 h-7 w-28 rounded bg-gray-200" />
                <div className="mb-5 h-4 w-36 rounded bg-gray-200" />
                <div className="h-10 w-full rounded-lg bg-gray-200" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}