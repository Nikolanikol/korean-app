import { useSettingsStore } from '@/store/settingsStore';
import * as Speech from 'expo-speech';
import { useRef } from 'react';

// ⬇️ ГЛОБАЛЬНЫЙ ФЛАГ (вне хука, чтобы работал между всеми экземплярами)
let globalIsSpeaking = false;

export const useTTS = () => {
  const { settings } = useSettingsStore();
  const isSpeakingRef = useRef(false); // ⬅️ Локальный ref для отслеживания

  const speak = async (text: string, language: string = 'ko-KR') => {
    // Проверяем что звуки включены
    if (!settings.soundEnabled) return;

    // ⬇️ ЗАЩИТА: Если уже что-то произносится - игнорируем
    if (globalIsSpeaking) {
      console.log('TTS: Already speaking, skipping...');
      return;
    }

    try {
      // Устанавливаем флаг что начинаем говорить
      globalIsSpeaking = true;
      isSpeakingRef.current = true;

      // Останавливаем предыдущее воспроизведение (на всякий случай)
      await Speech.stop();

      // ⬇️ Небольшая задержка чтобы stop() точно успел
      await new Promise(resolve => setTimeout(resolve, 50));

      // Произносим текст
      await Speech.speak(text, {
        language: language,
        pitch: 1.0,
        rate: 0.75,
        volume: 1.0,
        onDone: () => {
          // ⬇️ Сбрасываем флаг когда закончили
          globalIsSpeaking = false;
          isSpeakingRef.current = false;
        },
        onError: () => {
          // ⬇️ Сбрасываем флаг при ошибке
          globalIsSpeaking = false;
          isSpeakingRef.current = false;
        },
        onStopped: () => {
          // ⬇️ Сбрасываем флаг если остановили
          globalIsSpeaking = false;
          isSpeakingRef.current = false;
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      // ⬇️ Сбрасываем флаг при ошибке
      globalIsSpeaking = false;
      isSpeakingRef.current = false;
    }
  };

  const speakKorean = (text: string) => speak(text, 'ko-KR');
  const speakRussian = (text: string) => speak(text, 'ru-RU');
  
  const stop = async () => {
    await Speech.stop();
    globalIsSpeaking = false;
    isSpeakingRef.current = false;
  };

  // ⬇️ ДОБАВИЛИ: Проверка статуса
  const isSpeaking = () => globalIsSpeaking;

  return {
    speak,
    speakKorean,
    speakRussian,
    stop,
    isSpeaking, // ⬅️ Можно использовать для UI индикации
  };
};