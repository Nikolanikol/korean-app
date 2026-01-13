// utils/responsive.ts
import { Dimensions, PixelRatio, Platform } from 'react-native';

/**
 * Утилиты для адаптивного дизайна
 * Решают проблемы с разными размерами устройств
 */

// ============================================
// 1. РАЗМЕРЫ ЭКРАНА
// ============================================

export interface ScreenSize {
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isTablet: boolean;
  shortestSide: number;
}

/**
 * Получить информацию о размере экрана
 */
export const getScreenSize = (): ScreenSize => {
  const { width, height } = Dimensions.get('window');
  const shortestSide = Math.min(width, height);
  
  return {
    width,
    height,
    shortestSide,
    isSmall: shortestSide < 375,      // iPhone SE, старые Android
    isMedium: shortestSide >= 375 && shortestSide < 768,  // Обычные телефоны
    isLarge: shortestSide >= 768 && shortestSide < 1024,  // Большие телефоны, маленькие планшеты
    isTablet: shortestSide >= 768,    // Планшеты
  };
};

/**
 * Breakpoints для адаптивного дизайна
 */
export const BREAKPOINTS = {
  small: 375,   // iPhone SE
  medium: 414,  // iPhone 13 Pro Max
  large: 768,   // iPad Mini
  xlarge: 1024, // iPad Pro
} as const;

/**
 * Проверить размер экрана
 */
export const isScreenSize = (size: keyof typeof BREAKPOINTS): boolean => {
  const { width } = Dimensions.get('window');
  return width >= BREAKPOINTS[size];
};

// ============================================
// 2. МАСШТАБИРОВАНИЕ
// ============================================

/**
 * Базовые размеры для дизайна (обычно iPhone 13)
 */
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Масштабировать размер по ширине экрана
 * Используйте для горизонтальных размеров (width, marginHorizontal, paddingHorizontal)
 */
export const scale = (size: number): number => {
  const { width } = Dimensions.get('window');
  return (width / BASE_WIDTH) * size;
};

/**
 * Масштабировать размер по высоте экрана
 * Используйте для вертикальных размеров (height, marginVertical, paddingVertical)
 */
export const verticalScale = (size: number): number => {
  const { height } = Dimensions.get('window');
  return (height / BASE_HEIGHT) * size;
};

/**
 * Умеренное масштабирование
 * Меньше зависит от размера экрана (для шрифтов, иконок)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Примеры использования:
 * 
 * width: scale(100)           // Масштабируется по ширине
 * height: verticalScale(50)   // Масштабируется по высоте
 * fontSize: moderateScale(16) // Умеренное масштабирование для шрифтов
 * iconSize: moderateScale(24) // Умеренное масштабирование для иконок
 */

// ============================================
// 3. АДАПТИВНЫЕ ЗНАЧЕНИЯ
// ============================================

/**
 * Получить значение в зависимости от размера экрана
 */
export const responsive = <T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  default: T;
}): T => {
  const screen = getScreenSize();
  
  if (screen.isTablet && values.tablet !== undefined) return values.tablet;
  if (screen.isLarge && values.large !== undefined) return values.large;
  if (screen.isMedium && values.medium !== undefined) return values.medium;
  if (screen.isSmall && values.small !== undefined) return values.small;
  
  return values.default;
};

/**
 * Примеры использования:
 * 
 * const padding = responsive({
 *   small: 12,
 *   medium: 16,
 *   tablet: 24,
 *   default: 16,
 * });
 * 
 * const columns = responsive({
 *   small: 1,
 *   medium: 1,
 *   tablet: 2,
 *   default: 1,
 * });
 */

// ============================================
// 4. ОРИЕНТАЦИЯ
// ============================================

export type Orientation = 'portrait' | 'landscape';

/**
 * Получить текущую ориентацию
 */
export const getOrientation = (): Orientation => {
  const { width, height } = Dimensions.get('window');
  return width > height ? 'landscape' : 'portrait';
};

/**
 * Проверить ориентацию
 */
export const isLandscape = (): boolean => getOrientation() === 'landscape';
export const isPortrait = (): boolean => getOrientation() === 'portrait';

// ============================================
// 5. ПЛОТНОСТЬ ПИКСЕЛЕЙ
// ============================================

/**
 * Получить плотность пикселей
 */
export const getPixelDensity = () => {
  const density = PixelRatio.get();
  
  return {
    density,
    isLDPI: density < 1.5,      // 120 dpi
    isMDPI: density >= 1 && density < 2,      // 160 dpi
    isHDPI: density >= 1.5 && density < 2.5,  // 240 dpi
    isXHDPI: density >= 2 && density < 3,     // 320 dpi
    isXXHDPI: density >= 3 && density < 4,    // 480 dpi
    isXXXHDPI: density >= 4,                  // 640 dpi
  };
};

/**
 * Получить размер для текущей плотности
 */
export const dpToPixels = (dp: number): number => {
  return PixelRatio.getPixelSizeForLayoutSize(dp);
};

/**
 * Получить dp из пикселей
 */
export const pixelsToDp = (pixels: number): number => {
  return pixels / PixelRatio.get();
};

// ============================================
// 6. СООТНОШЕНИЕ СТОРОН
// ============================================

/**
 * Получить соотношение сторон экрана
 */
export const getAspectRatio = (): number => {
  const { width, height } = Dimensions.get('window');
  return height / width;
};

/**
 * Проверить тип соотношения сторон
 */
export const getAspectRatioType = (): {
  ratio: number;
  isNormal: boolean;    // ~16:9 (1.77)
  isTall: boolean;      // ~19:9 (2.11)
  isExtraTall: boolean; // ~21:9 (2.33)
  category: 'normal' | 'tall' | 'extra-tall';
} => {
  const ratio = getAspectRatio();
  
  return {
    ratio,
    isNormal: ratio < 2.0,
    isTall: ratio >= 2.0 && ratio < 2.2,
    isExtraTall: ratio >= 2.2,
    category: ratio < 2.0 ? 'normal' : ratio < 2.2 ? 'tall' : 'extra-tall',
  };
};

/**
 * Ограничить высоту контента для длинных экранов
 */
export const getMaxContentHeight = (): number => {
  const { height } = Dimensions.get('window');
  const aspectRatio = getAspectRatioType();
  
  // На длинных экранах ограничиваем высоту
  if (aspectRatio.isExtraTall) {
    return height * 0.6; // Максимум 60% высоты
  }
  if (aspectRatio.isTall) {
    return height * 0.7; // Максимум 70% высоты
  }
  return height * 0.8; // Максимум 80% высоты
};

// ============================================
// 7. PLATFORM SPECIFIC
// ============================================

/**
 * Получить платформо-специфичное значение
 */
export const platformValue = <T>(ios: T, android: T): T => {
  return Platform.select({ ios, android }) as T;
};

/**
 * Проверить платформу
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

// ============================================
// 8. ПОЛЕЗНЫЕ КОНСТАНТЫ
// ============================================

/**
 * Минимальные размеры для touch targets (Apple HIG / Material Design)
 */
export const MINIMUM_TOUCH_SIZE = {
  ios: 44,      // Apple HIG: 44x44 pts
  android: 48,  // Material Design: 48x48 dp
  get current() {
    return platformValue(this.ios, this.android);
  },
} as const;

/**
 * Рекомендуемые размеры шрифтов
 */
export const FONT_SIZES = {
  tiny: responsive({ small: 10, default: 11, tablet: 12 }),
  small: responsive({ small: 12, default: 13, tablet: 14 }),
  base: responsive({ small: 14, default: 16, tablet: 18 }),
  medium: responsive({ small: 16, default: 18, tablet: 20 }),
  large: responsive({ small: 18, default: 20, tablet: 24 }),
  xlarge: responsive({ small: 22, default: 24, tablet: 28 }),
  xxlarge: responsive({ small: 28, default: 32, tablet: 36 }),
} as const;

/**
 * Рекомендуемые отступы
 */
export const SPACING = {
  xs: responsive({ small: 4, default: 4, tablet: 6 }),
  sm: responsive({ small: 8, default: 8, tablet: 12 }),
  md: responsive({ small: 12, default: 16, tablet: 20 }),
  lg: responsive({ small: 16, default: 20, tablet: 24 }),
  xl: responsive({ small: 20, default: 24, tablet: 32 }),
  xxl: responsive({ small: 24, default: 32, tablet: 40 }),
} as const;

// ============================================
// 9. СПЕЦИАЛЬНЫЕ УТИЛИТЫ
// ============================================

/**
 * Проверить наличие физического notch/dynamic island
 */
export const hasNotch = (): boolean => {
  const { height, width } = Dimensions.get('window');
  
  if (Platform.OS === 'ios') {
    // iPhone X и новее
    return (
      (height === 812 || height === 896 || height === 844 || height === 926) &&
      width === 390 || width === 393 || width === 414 || width === 428
    );
  }
  
  // Android с вырезом обычно имеет statusBarHeight > 24
  return false; // Нужен StatusBar API для точного определения
};

/**
 * Безопасная зона для контента (не touch targets)
 * Учитывает thumbs zone для больших телефонов
 */
export const getThumbZone = (): {
  topSafe: number;    // Безопасная зона сверху
  bottomSafe: number; // Безопасная зона снизу (большой палец)
} => {
  const { height } = Dimensions.get('window');
  const screen = getScreenSize();
  
  if (screen.isTablet) {
    return { topSafe: 0, bottomSafe: 0 }; // На планшете держат двумя руками
  }
  
  // На больших телефонах нижние 1/3 экрана легче достать большим пальцем
  const thumbReach = height / 3;
  
  return {
    topSafe: height * 0.2,  // Верхние 20% сложно достать
    bottomSafe: thumbReach,  // Нижние 33% - зона большого пальца
  };
};

/**
 * Определить тип устройства
 */
export const getDeviceType = (): 'phone' | 'tablet' | 'foldable' => {
  const { width, height } = Dimensions.get('window');
  const shortestSide = Math.min(width, height);
  
  // Складные телефоны в развернутом виде
  if (shortestSide >= 600 && shortestSide < 768) {
    return 'foldable';
  }
  
  // Планшеты
  if (shortestSide >= 768) {
    return 'tablet';
  }
  
  return 'phone';
};

// ============================================
// ЭКСПОРТ ВСЕХ УТИЛИТ
// ============================================

export default {
  // Размеры
  getScreenSize,
  isScreenSize,
  BREAKPOINTS,
  
  // Масштабирование
  scale,
  verticalScale,
  moderateScale,
  
  // Адаптивные значения
  responsive,
  
  // Ориентация
  getOrientation,
  isLandscape,
  isPortrait,
  
  // Плотность
  getPixelDensity,
  dpToPixels,
  pixelsToDp,
  
  // Соотношение сторон
  getAspectRatio,
  getAspectRatioType,
  getMaxContentHeight,
  
  // Платформа
  platformValue,
  isIOS,
  isAndroid,
  isWeb,
  
  // Константы
  MINIMUM_TOUCH_SIZE,
  FONT_SIZES,
  SPACING,
  
  // Специальные
  hasNotch,
  getThumbZone,
  getDeviceType,
};

/**
 * ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:
 * 
 * import { scale, responsive, getScreenSize, FONT_SIZES } from '@/utils/responsive';
 * 
 * // 1. Масштабирование
 * const styles = StyleSheet.create({
 *   container: {
 *     paddingHorizontal: scale(16),      // Масштабируется по ширине
 *     paddingVertical: verticalScale(20), // Масштабируется по высоте
 *   },
 *   text: {
 *     fontSize: moderateScale(16),        // Умеренное масштабирование
 *   },
 * });
 * 
 * // 2. Адаптивные значения
 * const columns = responsive({
 *   small: 1,
 *   tablet: 2,
 *   default: 1,
 * });
 * 
 * const padding = responsive({
 *   small: 12,
 *   medium: 16,
 *   tablet: 24,
 *   default: 16,
 * });
 * 
 * // 3. Проверка размера
 * const screen = getScreenSize();
 * if (screen.isSmall) {
 *   // Компактный layout для маленьких экранов
 * }
 * 
 * // 4. Использование констант
 * <Text style={{ fontSize: FONT_SIZES.large }}>Заголовок</Text>
 * <View style={{ padding: SPACING.md }}>Контент</View>
 */