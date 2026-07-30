"use client";

import { useEffect, useRef } from "react";
import { ADSENSE } from "@/lib/adsense";

interface AdBannerProps {
  slotKey: keyof typeof ADSENSE.slots;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdBanner({ slotKey, format = "auto", className = "" }: AdBannerProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE.publisherId}
        data-ad-slot={ADSENSE.slots[slotKey]}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
