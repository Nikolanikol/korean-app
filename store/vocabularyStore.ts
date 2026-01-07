import { create } from 'zustand';
import { Vocabulary, VocabularyWithWords } from '@/types/vocabulary';
import { mockVocabularies, mockVocabulariesWithWords } from '@/mocks/vocabularies.mock';

interface VocabularyStore {
  vocabularies: Vocabulary[];
  selectedVocabulary: VocabularyWithWords | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchVocabularies: () => Promise<void>;
  fetchVocabularyById: (id: string) => Promise<void>;
  createVocabulary: (vocab: Omit<Vocabulary, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVocabulary: (id: string, updates: Partial<Vocabulary>) => Promise<void>;
  deleteVocabulary: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useVocabularyStore = create<VocabularyStore>((set, get) => ({
  vocabularies: [],
  selectedVocabulary: null,
  isLoading: false,
  error: null,

  fetchVocabularies: async () => {
    set({ isLoading: true, error: null });
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ vocabularies: mockVocabularies, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch vocabularies', isLoading: false });
    }
  },

  fetchVocabularyById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const vocab = mockVocabulariesWithWords.find(v => v.id === id);
      if (!vocab) throw new Error('Vocabulary not found');
      set({ selectedVocabulary: vocab, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch vocabulary', isLoading: false });
    }
  },

  createVocabulary: async (vocab) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newVocab: Vocabulary = {
        ...vocab,
        id: `vocab-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set(state => ({
        vocabularies: [...state.vocabularies, newVocab],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create vocabulary', isLoading: false });
    }
  },

  updateVocabulary: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      set(state => ({
        vocabularies: state.vocabularies.map(v =>
          v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update vocabulary', isLoading: false });
    }
  },

  deleteVocabulary: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      set(state => ({
        vocabularies: state.vocabularies.filter(v => v.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete vocabulary', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));