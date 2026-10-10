
"use client";

import { authClient } from "@/lib/auth-client";

export default function UserInfo() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p>Loading user...</p>;
  }

  if (!session) {
    return <p>You are not signed in.</p>;
  }

  return (
    <div className="rounded-xl border p-4">
      <h2 className="text-lg font-bold">Logged-in User</h2>
      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
    </div>
  );
}
