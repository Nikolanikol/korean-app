import { useSettingsStore } from '@/store/settingsStore';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const useHaptics = () => {
  const { settings } = useSettingsStore();

  const playHaptic = async (type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => {
    // Проверяем что вибрация включена в настройках
    if (!settings.hapticsEnabled) return;
    
    // Haptics работает только на мобильных
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

    try {
      switch (type) {
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    } catch (error) {
      // Игнорируем ошибки - не критично если вибрация не сработала
      console.log('Haptics error:', error);
    }
  };

  return {
    playSuccess: () => playHaptic('success'),
    playError: () => playHaptic('error'),
    playWarning: () => playHaptic('warning'),
    playLight: () => playHaptic('light'),
    playMedium: () => playHaptic('medium'),
    playHeavy: () => playHaptic('heavy'),
  };
};