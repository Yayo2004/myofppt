"use client";

import { FileText } from "lucide-react";

interface PdfThumbnailProps {
  url: string;
  className?: string;
}

export function PdfThumbnail({ url, className = "" }: PdfThumbnailProps) {
  return (
    <div className={`w-full h-[180px] overflow-hidden rounded-t-xl relative bg-gray-50 ${className}`}>
      <object data={url} type="application/pdf" width="100%" height="100%">
        <div className="w-full h-full flex items-center justify-center">
          <FileText className="h-10 w-10 text-gray-300" />
        </div>
      </object>
    </div>
  );
}
