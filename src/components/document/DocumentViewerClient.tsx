"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Eye, FileText, Calendar, FileArchive } from "lucide-react";
import { useDocument, useRelatedDocuments } from "@/hooks/use-documents";
import { AdBanner } from "@/components/ads/AdBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFileSize, formatDate } from "@/lib/utils";
import { DocumentCard } from "@/components/document/DocumentCard";
import { api, getFileDownloadUrl } from "@/lib/api";
import { resolveDescription } from "@/lib/description";
import type { AppDoc } from "@/types/document";

export default function DocumentViewerClient({
  initialDoc,
  pageUrl,
  breadcrumbLd,
}: {
  initialDoc?: AppDoc;
  pageUrl?: string;
  breadcrumbLd?: string;
}) {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: doc, isLoading } = useDocument(slug, initialDoc);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (doc?.id) {
      api.post(`/documents/${doc.id}/view`).catch(() => {});
    }
  }, [doc?.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Skeleton className="mb-4 h-8 w-64" />
        <Skeleton className="mb-8 h-4 w-96" />
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-300">Document introuvable</h1>
        <Button className="mt-4" onClick={() => router.push("/")}>Retour à l&apos;accueil</Button>
      </div>
    );
  }

  const fileUrl = getFileDownloadUrl(doc);
  const description = resolveDescription(doc);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-28">
      {/* Breadcrumb JSON-LD */}
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbLd }}
        />
      )}

      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {doc.category && <CategoryBadge name={doc.category.name || doc.categoryName} />}
          {doc.level && <Badge variant="secondary">{doc.level.name || doc.levelName}</Badge>}
          {doc.filiere && <Badge variant="outline">{doc.filiere.name || doc.filiereName}</Badge>}
          {doc.module && <Badge variant="outline">{doc.module.name || doc.moduleName}</Badge>}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{doc.title}</h1>
        {description && (
          <div className="mt-2 text-lg text-gray-600 whitespace-pre-line leading-relaxed">
            {description}
          </div>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{doc.views} vues</span>
        <span className="flex items-center gap-1"><Download className="h-4 w-4" />{doc.downloads} téléchargements</span>
        <span className="flex items-center gap-1"><FileText className="h-4 w-4" />{formatFileSize(doc.fileSize || 0)}</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(doc.createdAt)}</span>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={async () => {
            try {
              await api.post(`/documents/${doc.id}/download`);
              const res = await fetch(fileUrl);
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = doc.fileName;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            } catch {}
          }}
          className="uiverse-btn"
        >
          <div className="wrapper flex items-center gap-2">
            <span>Télécharger</span>
            <div className="circle circle-12" />
            <div className="circle circle-11" />
            <div className="circle circle-10" />
            <div className="circle circle-9" />
            <div className="circle circle-8" />
            <div className="circle circle-7" />
            <div className="circle circle-6" />
            <div className="circle circle-5" />
            <div className="circle circle-4" />
            <div className="circle circle-3" />
            <div className="circle circle-2" />
            <div className="circle circle-1" />
          </div>
        </button>
      </div>

      {showPreview && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          {doc.fileType === "zip" ? (
            <div className="flex h-[400px] items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <FileArchive className="h-24 w-24 text-orange-500" />
                  <span className="absolute -bottom-2 -right-3 rounded-lg bg-orange-500 px-2 py-1 text-sm font-bold text-white">ZIP</span>
                </div>
                <p className="text-lg font-medium text-orange-700">Archive ZIP</p>
                <p className="text-sm text-orange-500">Ce fichier ne peut pas être prévisualisé. Utilisez le bouton Télécharger.</p>
              </div>
            </div>
          ) : (
            <iframe
              src={fileUrl}
              className="h-[600px] w-full md:h-[800px]"
              title={doc.title}
            />
          )}
        </div>
      )}

      <AdBanner slotKey="documentBelowContent" className="my-8" />

      <RelatedDocuments docId={doc.id} filiereName={doc.filiere?.name} />

      {/* SEO JSON-LD for this document */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalCredential",
            name: doc.title,
            description,
            url: pageUrl || (typeof window !== "undefined" ? window.location.href : ""),
            educationalLevel: doc.level?.name || doc.levelName,
            educationalProgramMode: doc.filiere?.name || doc.filiereName,
            teaches: doc.module?.name || doc.moduleName,
            credentialCategory: doc.category?.name || doc.categoryName,
          }),
        }}
      />
    </div>
  );
}

function RelatedDocuments({ docId, filiereName }: { docId: string; filiereName?: string }) {
  const { data: related, isLoading } = useRelatedDocuments(docId);

  if (!filiereName) return null;

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Documents similaires</h2>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : !related?.length ? (
        <p className="text-sm text-gray-400">Aucun document similaire trouvé</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {related.map((doc: any, i: number) => (
            <DocumentCard key={doc.id} doc={doc} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
