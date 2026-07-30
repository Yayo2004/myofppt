"use client";

import Script from "next/script";
import { ADSENSE } from "@/lib/adsense";

export function AdScript() {
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.publisherId}`}
      crossOrigin="anonymous"
    />
  );
}
