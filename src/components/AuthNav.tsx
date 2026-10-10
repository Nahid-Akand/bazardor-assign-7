"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type AvatarProps = {
  image?: string | null;
  name?: string | null;
  size?: string;
};

function Avatar({ image, name, size = "h-9 w-9" }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initial = name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-primary-content`}
    >
      {image && !imageFailed ? (
        <img
          src={image}
          alt="প্রোফাইল"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
}

export default function AuthNav() {
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Sign out failed:", error);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <div className="h-9 w-32 animate-pulse rounded-lg bg-base-200" />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="btn btn-outline btn-primary btn-sm sm:btn-md"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="btn btn-primary btn-sm sm:btn-md"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label="ইউজার মেনু"
        className="flex max-w-[220px] items-center gap-2 rounded-full border border-base-300 bg-base-100 p-1.5 pr-3 transition hover:bg-base-200"
      >
        <Avatar image={user.image} name={user.name} />

        <span className="truncate text-sm font-semibold">
          {user.name || user.email}
        </span>

        <span aria-hidden="true" className="text-xs">
          {menuOpen ? "▲" : "▼"}
        </span>
      </button>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="মেনু বন্ধ করুন"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl">
            <div className="border-b border-base-300 px-2 pb-3">
              <div className="flex items-center gap-3">
                <Avatar
                  image={user.image}
                  name={user.name}
                  size="h-10 w-10"
                />

                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {user.name || "ব্যবহারকারী"}
                  </p>

                  <p className="truncate text-sm text-base-content/60">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="btn btn-ghost btn-sm mt-2 w-full justify-start"
            >
              <span aria-hidden="true">👤</span>
              আমার প্রোফাইল
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn btn-ghost btn-sm mt-1 w-full justify-start text-error"
            >
              {signingOut ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <span aria-hidden="true">↩</span>
              )}

              {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}