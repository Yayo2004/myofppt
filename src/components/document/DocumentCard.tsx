"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Download, Eye, ArrowUpRight, FileArchive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { PdfThumbnail } from "@/components/document/PdfThumbnail";
import { getThumbnailUrl } from "@/lib/api";

interface Doc {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  fileType: string;
  fileSize?: number;
  storageUrl?: string;
  thumbnailUrl?: string;
  views: number;
  downloads: number;
  level?: { name: string };
  filiere?: { name: string };
  module?: { name: string };
  category?: { name: string };
}

export function DocumentCard({ doc, index = 0 }: { doc: Doc; index?: number }) {
  const href = doc.slug ? `/documents/${doc.slug}` : `/docs/${doc.id}`;
  const isPdf = doc.fileType === "pdf";
  const isZip = doc.fileType === "zip";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#ad46ff] hover:shadow-xl hover:shadow-[#ad46ff]/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#ad46ff]/[0.04] via-transparent to-purple-500/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {(isPdf || isZip) && (
          <div className="relative overflow-hidden">
            {isZip ? (
              <div className="flex h-[180px] items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <FileArchive className="h-16 w-16 text-orange-500" />
                    <span className="absolute -bottom-1 -right-2 rounded-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">ZIP</span>
                  </div>
                  <span className="text-xs font-medium text-orange-600">Archive ZIP</span>
                </div>
              </div>
            ) : (
              <PdfThumbnail src={getThumbnailUrl(doc)} alt={doc.title} />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/10">
              <span className="flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5 text-gray-700" />
              </span>
            </div>
          </div>
        )}
        <div className="relative p-4">
          <h3 className="font-semibold text-gray-900 transition-colors duration-300 group-hover:text-[#ad46ff] line-clamp-1">
            {doc.title}
          </h3>
          {doc.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{doc.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {doc.category && <CategoryBadge name={doc.category.name} />}
            {doc.level && <Badge variant="secondary">{doc.level.name}</Badge>}
            {doc.filiere && <Badge variant="outline">{doc.filiere.name}</Badge>}
            {doc.module && <Badge variant="outline">{doc.module.name}</Badge>}
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{doc.views}</span>
            <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" />{doc.downloads}</span>
            <FileText className="ml-auto h-4 w-4 text-gray-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
