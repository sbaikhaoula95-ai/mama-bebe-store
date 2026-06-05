"use client";

import { useEffect } from "react";
import { loadPixelsDeferred } from "@/lib/tracking-client";

export function PixelLoader() {
  useEffect(() => {
    loadPixelsDeferred();
  }, []);

  return null;
}
