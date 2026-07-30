import { cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/category-meta";

export function CategoryBadge({ name, className }: { name: string; className?: string }) {
  const meta = getCategoryMeta(name);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        meta.badgeBg,
        meta.badgeText,
        className
      )}
    >
      {name}
    </span>
  );
}
