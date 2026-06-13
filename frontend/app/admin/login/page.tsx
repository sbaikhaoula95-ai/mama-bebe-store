"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminApi, setAdminToken } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await adminApi.login(username, password);
      setAdminToken(res.token, res.expiresAt);
      router.replace("/admin");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-pharmacy text-cream flex items-center justify-center font-bold text-2xl">
            ✚
          </div>
          <div>
            <p className="text-lg font-bold">HNINA Admin</p>
            <p className="text-xs text-slate-500">Pharmacie Hnina · Dashboard</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1">Sign in</h1>
        <p className="text-slate-500 text-sm mb-6">
          Use the admin credentials configured on the backend.
        </p>

        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:border-pharmacy focus:ring-2 focus:ring-pharmacy/15"
        />

        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 mb-6 focus:outline-none focus:border-pharmacy focus:ring-2 focus:ring-pharmacy/15"
        />

        {error && (
          <div className="mb-4 px-3 py-2.5 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pharmacy text-cream font-bold py-3 rounded-lg hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-xs text-slate-400 mt-6 text-center">
          Set <code className="bg-slate-100 px-1 rounded">ADMIN_USERNAME</code>{" "}
          and <code className="bg-slate-100 px-1 rounded">ADMIN_PASSWORD</code>{" "}
          in the backend environment.
        </p>
      </form>
    </div>
  );
}
