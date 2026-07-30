import { create } from "zustand";

export interface FilterState {
  step: 0 | 1 | 2 | 3 | 4;
  levelId: string | null;
  levelName: string | null;
  filiereId: string | null;
  filiereName: string | null;
  filiereCode: string | null;
  filiereSlug: string | null;
  moduleId: string | null;
  moduleName: string | null;
  categoryId: string | null;
  categoryName: string | null;

  setLevel: (id: string, name: string) => void;
  setFiliere: (id: string, name: string, code: string, slug: string) => void;
  setModule: (id: string, name: string) => void;
  setCategory: (id: string, name: string) => void;
  goToStep: (step: 0 | 1 | 2 | 3 | 4) => void;
  reset: () => void;
  back: () => void;
}

const initialState = {
  step: 0 as const,
  levelId: null,
  levelName: null,
  filiereId: null,
  filiereName: null,
  filiereCode: null,
  filiereSlug: null,
  moduleId: null,
  moduleName: null,
  categoryId: null,
  categoryName: null,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,

  setLevel: (id, name) =>
    set({ levelId: id, levelName: name, step: 1 }),

  setFiliere: (id, name, code, slug) =>
    set({ filiereId: id, filiereName: name, filiereCode: code, filiereSlug: slug, step: 2 }),

  setModule: (id, name) =>
    set({ moduleId: id, moduleName: name, step: 3 }),

  setCategory: (id, name) =>
    set({ categoryId: id, categoryName: name, step: 4 }),

  goToStep: (step) => set({ step }),

  reset: () => set(initialState),

  back: () => {
    const { step } = get();
    if (step === 1) set({ levelId: null, levelName: null, step: 0 });
    else if (step === 2) set({ filiereId: null, filiereName: null, filiereCode: null, step: 1 });
    else if (step === 3) set({ moduleId: null, moduleName: null, step: 2 });
    else if (step === 4) set({ categoryId: null, categoryName: null, step: 3 });
  },
}));
