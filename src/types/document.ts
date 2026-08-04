export interface AppDoc {
  id: string;
  title: string;
  slug?: string;
  description?: string | null;
  fileName: string;
  fileSize?: number;
  fileType: string;
  storageUrl?: string | null;
  thumbnailUrl?: string | null;
  hasThumbnail?: boolean;
  views: number;
  downloads: number;
  createdAt?: string;
  updatedAt?: string;
  seoTitle?: string | null;
  seoDesc?: string | null;
  levelId?: string;
  filiereId?: string;
  moduleId?: string;
  categoryId?: string;
  level?: { name: string } | null;
  filiere?: { name: string } | null;
  module?: { name: string } | null;
  category?: { name: string } | null;
  levelName?: string | null;
  filiereName?: string | null;
  moduleName?: string | null;
  categoryName?: string | null;
}

export interface DocumentsPage {
  docs: AppDoc[];
  total: number;
  page: number;
  totalPages: number;
  params?: Record<string, string>;
}
