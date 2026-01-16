import { useSettingsStore } from '@/store/settingsStore';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

interface SoundSet {
  success?: Audio.Sound;
  complete?: Audio.Sound;
  error?: Audio.Sound;
}

export const useSounds = () => {
  const { settings } = useSettingsStore();
  const [sounds, setSounds] = useState<SoundSet>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSounds();
    
    return () => {
      // Очистка при размонтировании
      Object.values(sounds).forEach(sound => {
        sound?.unloadAsync();
      });
    };
  }, [settings.soundTheme]); // Перезагружаем при смене темы

  const loadSounds = async () => {
    try {
      // Выбираем папку в зависимости от темы
      const soundPath = settings.soundTheme === 'gaming' ? 'gaming' : 'classic';
      
      // Загружаем звуки
      const { sound: successSound } = await Audio.Sound.createAsync(
        soundPath === 'gaming' 
          ? require('@/assets/sounds/gaming/success.mp3')
          : require('@/assets/sounds/classic/success.mp3')
      );
      
      const { sound: completeSound } = await Audio.Sound.createAsync(
        soundPath === 'gaming'
          ? require('@/assets/sounds/gaming/complete.mp3')
          : require('@/assets/sounds/classic/complete.mp3')
      );
      
      const { sound: errorSound } = await Audio.Sound.createAsync(
        soundPath === 'gaming'
          ? require('@/assets/sounds/gaming/error.mp3')
          : require('@/assets/sounds/classic/error.mp3')
      );
      
      setSounds({
        success: successSound,
        complete: completeSound,
        error: errorSound,
      });
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  };

  const playSound = async (type: 'success' | 'complete' | 'error') => {
    // Проверяем что звуки включены
    if (!settings.soundEnabled) return;
    
    // Проверяем что звуки загружены
    if (!isLoaded) return;

    try {
      const sound = sounds[type];
      if (!sound) return;

      // Останавливаем если играет
      await sound.stopAsync();
      
      // Перематываем в начало
      await sound.setPositionAsync(0);
      
      // Играем
      await sound.playAsync();
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
    }
  };

  return {
    playSuccess: () => playSound('success'),
    playComplete: () => playSound('complete'),
    playError: () => playSound('error'),
    isLoaded,
  };
};