export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'other';
export type StudyMode = 'flashcards' | 'multiple_choice' | 'typing' | 'matching';
export type WordStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface Word {
  id: string;
  vocabularyId: string;
  korean: string;
  translation: string;
  romanization?: string;
  partOfSpeech?: PartOfSpeech;
  exampleSentence?: string;
  exampleTranslation?: string;
  audioUrl?: string;
  imageUrl?: string;
  difficultyLevel?: DifficultyLevel;
  tags: string[];
  notes?: string;
  position: number;
  createdAt: string;
}

export interface Vocabulary {
  id: string;
  userId: string;
  title: string;
  description?: string;
  language: string;
  difficultyLevel?: DifficultyLevel;
  category?: string;
  tags: string[];
  isPublic: boolean;
  isOfficial: boolean;
  shareCode?: string;
  wordCount: number;
  forkCount: number;
  studyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyWithWords extends Vocabulary {
  words: Word[];
}

export interface Collection {
  id: string;
  userId: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  vocabularies: Vocabulary[];
  createdAt: string;
  updatedAt: string;
}
