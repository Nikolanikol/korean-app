import { useSettingsStore } from '@/store/settingsStore';
import * as Speech from 'expo-speech';

export const useTTS = () => {
  const { settings } = useSettingsStore();

  const speak = async (text: string, language: string = 'ko-KR') => {
    // Проверяем что звуки включены
    if (!settings.soundEnabled) return;

    try {
      // Останавливаем предыдущее воспроизведение если есть
      await Speech.stop();

      // Произносим текст
      await Speech.speak(text, {
        language: language,
        pitch: 1.0,        // Высота голоса (0.5 - 2.0)
        rate: 0.75,        // Скорость (0.1 - 2.0), 0.75 = немного медленнее
        volume: 1.0,       // Громкость (0.0 - 1.0)
      });
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const speakKorean = (text: string) => speak(text, 'ko-KR');
  const speakRussian = (text: string) => speak(text, 'ru-RU');
  const stop = () => Speech.stop();

  return {
    speak,
    speakKorean,
    speakRussian,
    stop,
  };
};