"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const sessionError = searchParams.get("error") === "session";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    const result = await signIn("credentials", {
      email: (data.get("email") as string).trim().toLowerCase(),
      password: data.get("password") as string,
      loginType: "admin",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid admin email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-3">GC Atelier</p>
          <h1 className="font-display text-[36px] font-light">Admin</h1>
          <p className="text-[13px] text-fg-3 mt-2">Staff sign-in only. Customers use the site menu.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-2 border border-border rounded-xl p-10"
        >
          {(error || sessionError) && (
            <p className="text-sm text-red-400 mb-5 bg-red-400/10 px-4 py-3 rounded-md">
              {error || "Session expired. Please sign in again."}
            </p>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[11px] tracking-widest text-fg-3 uppercase mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@gcatelier.com"
                className="w-full py-3.5 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-widest text-fg-3 uppercase mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full py-3.5 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-xs tracking-widest uppercase bg-sage text-bg py-4 hover:bg-sage-light transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-fg-3 mt-6">
          <a href="/" className="hover:text-sage transition-colors">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
