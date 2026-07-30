"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/use-documents";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_META, getCategoryMeta } from "@/lib/category-meta";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

function CategoryCard({ cat }: { cat: Category }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const meta = getCategoryMeta(cat.name);
  const Icon = meta.icon;

  const handleClick = () => {
    router.push(`/browse?categoryId=${cat.id}`);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative w-[230px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-gray-200/50 bg-white text-left backdrop-blur-sm transition-all duration-300 hover:border-transparent hover:-translate-y-1`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgHover} opacity-0 transition-opacity duration-300`} style={{ opacity: hovered ? 1 : 0 }} />

      <div className={`absolute -inset-px rounded-xl bg-gradient-to-br ${meta.borderHover} opacity-0 transition-opacity duration-300`} style={{ opacity: hovered ? 1 : 0 }} />

      <div className="relative z-10 flex flex-col items-center gap-3 px-5 py-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${meta.bgIcon} transition-colors duration-300`}>
          <Icon className={`h-5 w-5 ${meta.textColor}`} />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-gray-900">{cat.name}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium" style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(4px)', transition: 'all 0.3s ease' }}>
          <span className={meta.textColor}>Explorer</span>
          <ArrowRight className={`h-3.5 w-3.5 ${meta.textColor}`} />
        </div>
      </div>
    </button>
  );
}

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories?.length) {
    return (
      <section className="overflow-hidden px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto h-6 w-56 rounded-lg" />
            <Skeleton className="mx-auto mt-3 h-4 w-72 rounded-md" />
          </div>
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 min-w-[230px] shrink-0 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = [...categories, ...categories, ...categories, ...categories, ...categories];

  return (
    <section className="relative overflow-hidden py-12">
      <div className="mx-auto mb-8 max-w-6xl px-4 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gray-200/50 bg-white/50 px-4 py-1.5 text-sm font-medium text-gray-500 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-500" />
          </span>
          Explorez par catégorie
        </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
          Trouvez exactement{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">ce qu'il vous faut</span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
          Cliquez sur une catégorie pour découvrir les ressources correspondantes et accéder directement aux documents filtrés.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-gray-50 to-transparent" />

        <div className="overflow-hidden">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-230px * ${categories.length} - 16px * ${categories.length})); }
            }
            .marquee-track {
              animation: marquee 40s linear infinite;
              will-change: transform;
            }
            .marquee-container:hover .marquee-track {
              animation-play-state: paused;
            }
          `}</style>

          <div className="marquee-container">
            <div className="marquee-track flex gap-4 py-1">
              {items.map((cat: Category, i: number) => (
                <CategoryCard key={`${cat.id}-${i}`} cat={cat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
