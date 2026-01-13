import { User } from '@/types/user';

// Мок Google аккаунты для тестирования
export interface MockGoogleAccount {
  id: string;
  email: string;
  name: string;
  picture: string; // emoji или URL
  givenName?: string;
}

export const MOCK_GOOGLE_ACCOUNTS: MockGoogleAccount[] = [
  {
    id: 'user-google-1',
    email: 'nikolai.dev@gmail.com',
    name: 'Nikolai',
    givenName: 'Nikolai',
    picture: '👨‍💻',
  },
  {
    id: 'user-google-2',
    email: 'test.user@gmail.com',
    name: 'Test User',
    givenName: 'Test',
    picture: '👤',
  },
  {
    id: 'user-google-3',
    email: 'korean.learner@gmail.com',
    name: 'Korean Learner',
    givenName: 'Korean',
    picture: '🎓',
  },
];

// Функция для преобразования Google аккаунта в User
export const googleAccountToUser = (account: MockGoogleAccount): User => {
  return {
    id: account.id,
    email: account.email,
    username: account.name,
    nativeLanguage: 'ru',
    learningLanguage: 'ko',
    createdAt: new Date().toISOString(),
    
    // Новый пользователь - начальная статистика
    streakDays: 0,

    totalWordsLearned: 0,


    subscriptionTier: 'free',
    subscriptionExpiresAt: undefined,
  };
};