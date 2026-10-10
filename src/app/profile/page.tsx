
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session?.user]);

  if (isPending) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <p>প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
        <p className="mt-3">প্রোফাইল দেখতে আগে সাইন ইন করুন।</p>
        <Link href="/signin" className="btn btn-primary mt-4">
          সাইন ইন
        </Link>
      </main>
    );
  }

  const user = session.user;
  const initial = user.name?.trim().charAt(0).toUpperCase() || "U";

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { error: updateError } = await authClient.updateUser({
        name: name.trim(),
      });

      if (updateError) {
        setError(updateError.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }

      setMessage("আপনার নাম সফলভাবে আপডেট হয়েছে।");
    } catch {
      setError("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    const { error: signOutError } = await authClient.signOut();

    if (!signOutError) {
      router.push("/signin");
      router.refresh();
    } else {
      setError("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  return (
    <main className="min-h-[70vh] bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold">
              আমার প্রোফাইল
            </h1>

            <p className="text-sm text-base-content/60">
              আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
            </p>

            <div className="mt-4 flex items-center gap-4 rounded-xl bg-base-200 p-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt="প্রোফাইল"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-content">
                  {initial}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold">
                  {user.name || "ব্যবহারকারী"}
                </h2>
                <p className="truncate text-sm text-base-content/60">
                  {user.email}
                </p>
              </div>
            </div>

            {message && (
              <div role="status" className="alert alert-success mt-4">
                {message}
              </div>
            )}

            {error && (
              <div role="alert" className="alert alert-error mt-4">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              <h3 className="text-lg font-bold">তথ্য</h3>

              <div className="form-control">
                <label htmlFor="name" className="label">
                  <span className="label-text">নাম</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="আপনার নাম লিখুন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">ইমেইল</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="input input-bordered w-full"
                  value={user.email}
                  readOnly
                />
                <p className="mt-1 text-xs text-base-content/60">
                  ইমেইল পরিবর্তনের জন্য আলাদা যাচাইকরণ প্রক্রিয়া প্রয়োজন।
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={saving || !name.trim()}
              >
                {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
              </button>
            </form>

            <button
              type="button"
              onClick={handleSignOut}
              className="btn btn-outline btn-error mt-2 w-full"
            >
              ↩ সাইন আউট
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
