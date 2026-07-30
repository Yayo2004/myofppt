"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLatestDocuments } from "@/hooks/use-documents";
import { DocumentCard } from "@/components/document/DocumentCard";
import { Skeleton } from "@/components/ui/skeleton";

export function LatestSection() {
  const { data: docs, isLoading } = useLatestDocuments(6);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const dist = 340;
    scrollRef.current.scrollBy({ left: dir === "left" ? -dist : dist, behavior: "smooth" });
  }

  return (
    <section className="bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Derniers documents</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll("left")} className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scroll("right")} className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link href="/browse?sort=latest" className="group inline-flex items-center gap-1 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-800">
              Afficher plus <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 min-w-[300px] rounded-xl shrink-0" />
            ))}
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
            {docs?.map((doc: any, i: number) => (
              <div key={doc.id} className="min-w-[300px] max-w-[340px] shrink-0">
                <DocumentCard doc={doc} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}