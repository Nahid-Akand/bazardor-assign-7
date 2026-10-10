"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
        return;
      }

      setSuccess("সফলভাবে সাইন ইন হয়েছে!");

      window.location.href = "/";
    } catch {
      setError("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setError("");

    try {
      const { error: socialError } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (socialError) {
        setError(socialError.message || "সোশ্যাল সাইন ইন করা যায়নি।");
      }
    } catch {
      setError("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body gap-5 p-6 sm:p-8">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              বাজার দর
            </Link>

            <h1 className="mt-4 text-2xl font-bold">
              আবার স্বাগতম!
            </h1>

            <p className="mt-2 text-sm text-base-content/70">
              আপনার অ্যাকাউন্টে সাইন ইন করুন।
            </p>
          </div>

          {error && (
            <div role="alert" className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div role="status" className="alert alert-success text-sm">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium">ইমেইল</span>
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text font-medium">পাসওয়ার্ড</span>
              </label>

              <input
                id="password"
                type="password"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "সাইন ইন করুন"
              )}
            </button>
          </form>

          <div className="divider text-xs text-base-content/50">
            অথবা
          </div>

         <button
  type="button"
  onClick={async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }}
  className="btn btn-outline w-full"
>
  Google দিয়ে চালিয়ে যান
</button>

          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => handleSocialSignIn("github")}
          >
            GitHub দিয়ে চালিয়ে যান
          </button>

          <p className="text-center text-sm text-base-content/70">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>

          <Link
            href="/"
            className="text-center text-sm text-base-content/70 hover:text-primary"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}