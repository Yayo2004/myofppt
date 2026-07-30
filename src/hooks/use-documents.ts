import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface QueryParams {
  page?: number;
  limit?: number;
  levelId?: string;
  filiereId?: string;
  moduleId?: string;
  categoryId?: string;
  q?: string;
  sort?: string;
}

export function useDocuments(params: QueryParams = {}) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () =>
      api.get<{ docs: any[]; total: number; page: number; totalPages: number }>("/documents", {
        ...params,
        page: String(params.page || 1),
        limit: String(params.limit || 20),
      }),
  });
}

export function useDocument(slug: string) {
  return useQuery({
    queryKey: ["document", slug],
    queryFn: () => api.get<any>(`/documents/${slug}`),
    enabled: !!slug,
  });
}

export function usePopularDocuments(limit = 10) {
  return useQuery({
    queryKey: ["documents", "popular", limit],
    queryFn: () => api.get<any[]>(`/documents/popular`, { limit: String(limit) }),
  });
}

export function useLatestDocuments(limit = 10) {
  return useQuery({
    queryKey: ["documents", "latest", limit],
    queryFn: () => api.get<any[]>(`/documents/latest`, { limit: String(limit) }),
  });
}

export function useFilieres() {
  return useQuery({
    queryKey: ["filieres"],
    queryFn: () => api.get<any[]>("/filieres"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFiliere(slug: string) {
  return useQuery({
    queryKey: ["filiere", slug],
    queryFn: () => api.get<any>(`/filieres/${slug}`),
    enabled: !!slug,
  });
}

export function useLevels() {
  return useQuery({
    queryKey: ["levels"],
    queryFn: () => api.get<any[]>("/levels"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<any[]>("/categories"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedDocuments(id: string, limit = 4) {
  return useQuery({
    queryKey: ["documents", "related", id],
    queryFn: () => api.get<any[]>(`/documents/${id}/related`, { limit: String(limit) }),
    enabled: !!id,
  });
}

export function useSearch(q: string, filters?: Record<string, string>, page = 1) {
  return useQuery({
    queryKey: ["search", q, filters, page],
    queryFn: () =>
      api.get<{ results: any[]; total: number; page: number; totalPages: number }>("/search", {
        q,
        ...filters,
        page: String(page),
      }),
    enabled: !!q,
  });
}
