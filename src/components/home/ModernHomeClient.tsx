"use client";

import { useState } from "react";
import { HeroSection } from "./HeroSection";
import { PopularSection } from "./PopularSection";
import { LatestSection } from "./LatestSection";
import { CategoriesSection } from "./CategoriesSection";
import { AdBanner } from "@/components/ads/AdBanner";

export default function ModernHomeClient() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_50%)]" />

      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AdBanner slotKey="homeHeader" className="mx-auto my-8 max-w-4xl" />

      <CategoriesSection />
      <PopularSection />

      <AdBanner slotKey="homeBetweenSections" className="mx-auto my-8 max-w-4xl" />

      <LatestSection />
    </div>
  );
}
