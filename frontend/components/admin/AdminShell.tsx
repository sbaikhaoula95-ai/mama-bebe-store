"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAdminToken, isAdminAuthenticated } from "@/lib/admin-api";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/orders", label: "Orders", icon: "📦", exact: false },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) {
      setReady(true);
      return;
    }
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router, pathname, isLoginRoute]);

  if (isLoginRoute) {
    return (
      <div dir="ltr" className="min-h-screen bg-slate-50">
        {children}
      </div>
    );
  }

  if (!ready) {
    return (
      <div dir="ltr" className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-lg">Loading…</div>
      </div>
    );
  }

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  return (
    <div dir="ltr" className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-pharmacy text-cream flex items-center justify-center font-bold">
                ✚
              </div>
              <div>
                <p className="font-bold text-sm tracking-wide">HNINA</p>
                <p className="text-xs text-slate-500">Admin Dashboard</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-pharmacy text-cream"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-slate-500 hover:text-red-600 transition-colors px-3 py-2"
            >
              ⎋ Logout
            </button>
          </div>
        </aside>

        {/* Mobile topbar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pharmacy text-cream flex items-center justify-center font-bold text-sm">
              ✚
            </div>
            <span className="font-bold text-sm">HNINA Admin</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>

        {/* Main content */}
        <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 overflow-x-auto">
          <div className="md:hidden mb-4 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    active
                      ? "bg-pharmacy text-cream"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
