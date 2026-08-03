"use client";

import { FileText } from "lucide-react";

interface PdfThumbnailProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

export function PdfThumbnail({ src, alt = "", className = "" }: PdfThumbnailProps) {
  if (!src) {
    return (
      <div className={`w-full h-[180px] overflow-hidden rounded-t-xl relative bg-gray-50 flex items-center justify-center ${className}`}>
        <FileText className="h-10 w-10 text-gray-300" />
      </div>
    );
  }

  return (
    <div className={`w-full h-[180px] overflow-hidden rounded-t-xl relative bg-gray-50 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
