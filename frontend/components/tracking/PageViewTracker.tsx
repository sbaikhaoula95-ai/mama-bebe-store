"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hnina.shop";

const SESSION_KEY = "hnina_session_id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing && existing.length >= 16) return existing;
    const fresh = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    window.localStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return "";
  }
}

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSentRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip admin pages — we don't want to count our own visits.
    if (pathname?.startsWith("/admin")) return;

    const fullPath = `${pathname || "/"}${
      searchParams && searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    // De-duplicate identical consecutive fires (Next.js triggers effects more
    // than once during navigation transitions in dev).
    if (lastSentRef.current === fullPath) return;
    lastSentRef.current = fullPath;

    const sessionId = getOrCreateSessionId();

    const body = {
      sessionId,
      path: fullPath.slice(0, 2048),
      referrer: document.referrer ? document.referrer.slice(0, 2048) : null,
      utmSource: searchParams?.get("utm_source") || null,
      utmMedium: searchParams?.get("utm_medium") || null,
      utmCampaign: searchParams?.get("utm_campaign") || null,
      utmContent: searchParams?.get("utm_content") || null,
      utmTerm: searchParams?.get("utm_term") || null,
      fbclid: searchParams?.get("fbclid") || null,
      ttclid: searchParams?.get("ttclid") || null,
    };

    // Fire-and-forget. Use keepalive so it survives a quick page navigation.
    try {
      fetch(`${API_BASE}/api/track/pageview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {
        // Silent — analytics must never break the site.
      });
    } catch {
      // ignore
    }
  }, [pathname, searchParams]);

  return null;
}
