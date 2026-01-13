// hooks/useResponsive.ts
import {
    getAspectRatioType,
    getDeviceType,
    getOrientation,
    getScreenSize,
    Orientation,
    ScreenSize
} from '@/utils/responsive';
import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

/**
 * React хуки для адаптивного дизайна
 * Автоматически обновляются при изменении размера/ориентации экрана
 */

// ============================================
// 1. РАЗМЕРЫ ЭКРАНА
// ============================================

/**
 * Hook для отслеживания размеров экрана
 * Обновляется при изменении размера (например, поворот устройства)
 */
export const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize());
  
  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      setScreenSize(getScreenSize());
    };
    
    const subscription = Dimensions.addEventListener('change', handleChange);
    
    return () => subscription?.remove();
  }, []);
  
  return screenSize;
};

/**
 * Примеры использования:
 * 
 * const MyComponent = () => {
 *   const screen = useScreenSize();
 *   
 *   return (
 *     <View>
 *       {screen.isSmall && <Text>Маленький экран</Text>}
 *       {screen.isTablet && <Text>Планшет</Text>}
 *     </View>
 *   );
 * };
 */

// ============================================
// 2. ОРИЕНТАЦИЯ
// ============================================

/**
 * Hook для отслеживания ориентации экрана
 */
export const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>(getOrientation());
  
  useEffect(() => {
    const handleChange = () => {
      setOrientation(getOrientation());
    };
    
    const subscription = Dimensions.addEventListener('change', handleChange);
    
    return () => subscription?.remove();
  }, []);
  
  return orientation;
};

/**
 * Hook для проверки landscape режима
 */
export const useIsLandscape = (): boolean => {
  const orientation = useOrientation();
  return orientation === 'landscape';
};



// ============================================
// 3. СООТНОШЕНИЕ СТОРОН
// ============================================

/**
 * Hook для отслеживания соотношения сторон экрана
 */
export const useAspectRatio = () => {
  const [aspectRatio, setAspectRatio] = useState(getAspectRatioType());
  
  useEffect(() => {
    const handleChange = () => {
      setAspectRatio(getAspectRatioType());
    };
    
    const subscription = Dimensions.addEventListener('change', handleChange);
    
    return () => subscription?.remove();
  }, []);
  
  return aspectRatio;
};


// ============================================
// 4. ТИП УСТРОЙСТВА
// ============================================

/**
 * Hook для определения типа устройства
 */
export const useDeviceType = (): 'phone' | 'tablet' | 'foldable' => {
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet' | 'foldable'>(getDeviceType());
  
  useEffect(() => {
    const handleChange = () => {
      setDeviceType(getDeviceType());
    };
    
    const subscription = Dimensions.addEventListener('change', handleChange);
    
    return () => subscription?.remove();
  }, []);
  
  return deviceType;
};

/**
 * Примеры использования:
 * 
 * const VocabularyList = () => {
 *   const deviceType = useDeviceType();
 *   
 *   return (
 *     <FlatList
 *       data={vocabularies}
 *       numColumns={deviceType === 'tablet' ? 2 : 1}
 *       key={deviceType}  // Перерисовать при изменении
 *     />
 *   );
 * };
 */

// ============================================
// 5. DIMENSIONS (универсальный)
// ============================================

/**
 * Hook для отслеживания размеров окна
 * Возвращает текущие width и height
 */
export const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });
  
  useEffect(() => {
    const handleChange = ({ window, screen }: { 
      window: ScaledSize; 
      screen: ScaledSize;
    }) => {
      setDimensions({ window, screen });
    };
    
    const subscription = Dimensions.addEventListener('change', handleChange);
    
    return () => subscription?.remove();
  }, []);
  
  return dimensions;
};


// ============================================
// 6. АДАПТИВНОЕ ЗНАЧЕНИЕ
// ============================================

/**
 * Hook для получения адаптивного значения
 * Автоматически обновляется при изменении размера экрана
 */
export const useResponsiveValue = <T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  default: T;
}): T => {
  const screen = useScreenSize();
  
  if (screen.isTablet && values.tablet !== undefined) return values.tablet;
  if (screen.isLarge && values.large !== undefined) return values.large;
  if (screen.isMedium && values.medium !== undefined) return values.medium;
  if (screen.isSmall && values.small !== undefined) return values.small;
  
  return values.default;
};

/**
 * Примеры использования:
 * 
 * const MyComponent = () => {
 *   const padding = useResponsiveValue({
 *     small: 12,
 *     medium: 16,
 *     tablet: 24,
 *     default: 16,
 *   });
 *   
 *   const columns = useResponsiveValue({
 *     small: 1,
 *     tablet: 2,
 *     default: 1,
 *   });
 *   
 *   return (
 *     <View style={{ padding }}>
 *       <FlatList numColumns={columns} />
 *     </View>
 *   );
 * };
 */

// ============================================
// 7. СКЛАДНЫЕ УСТРОЙСТВА
// ============================================

/**
 * Hook специально для складных устройств
 * Определяет когда устройство сложено/развернуто
 */
export const useFoldable = () => {
  const [state, setState] = useState<{
    isFoldable: boolean;
    isUnfolded: boolean;
    screenMode: 'cover' | 'main' | 'normal';
  }>({
    isFoldable: false,
    isUnfolded: false,
    screenMode: 'normal',
  });
  
  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      const { width } = window;
      
      // Samsung Z Fold внутренний экран ≈ 768px+
      // Внешний экран ≈ 280-320px
      const isFoldable = (width > 250 && width < 350) || (width > 600 && width < 900);
      const isUnfolded = width > 600;
      
      setState({
        isFoldable,
        isUnfolded,
        screenMode: width < 350 ? 'cover' : width > 600 ? 'main' : 'normal',
      });
    };
    
    handleChange({ window: Dimensions.get('window') });
    
    const subscription = Dimensions.addEventListener('change', handleChange);
    
    return () => subscription?.remove();
  }, []);
  
  return state;
};

/**
 * Примеры использования:
 * 
 * const MyComponent = () => {
 *   const { isFoldable, isUnfolded, screenMode } = useFoldable();
 *   
 *   if (!isFoldable) {
 *     return <NormalLayout />;
 *   }
 *   
 *   return isUnfolded ? <TabletLayout /> : <CompactLayout />;
 * };
 */

// ============================================
// 8. КОМБИНИРОВАННЫЙ HOOK
// ============================================

/**
 * Универсальный hook со всей информацией об устройстве
 * Используйте когда нужно много информации одновременно
 */
export const useDevice = () => {
  const screenSize = useScreenSize();
  const orientation = useOrientation();
  const aspectRatio = useAspectRatio();
  const deviceType = useDeviceType();
  const dimensions = useDimensions();
  const foldable = useFoldable();
  
  return {
    // Размеры
    ...screenSize,
    
    // Ориентация
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    
    // Соотношение сторон
    aspectRatio: aspectRatio.ratio,
    aspectRatioType: aspectRatio.category,
    isTallScreen: aspectRatio.isTall || aspectRatio.isExtraTall,
    
    // Тип устройства
    deviceType,
    isPhone: deviceType === 'phone',
    isTablet: deviceType === 'tablet',
    isFoldable: deviceType === 'foldable',
    
    // Dimensions
    window: dimensions.window,
    screen: dimensions.screen,
    
    // Складные
    foldable,
  };
};

/**
 * Примеры использования:
 * 
 * const MyComponent = () => {
 *   const device = useDevice();
 *   
 *   console.log('Device info:', {
 *     type: device.deviceType,
 *     orientation: device.orientation,
 *     size: device.isSmall ? 'small' : device.isTablet ? 'tablet' : 'normal',
 *   });
 *   
 *   return (
 *     <View>
 *       {device.isSmall && <CompactLayout />}
 *       {device.isTablet && <TabletLayout />}
 *       {!device.isSmall && !device.isTablet && <NormalLayout />}
 *     </View>
 *   );
 * };
 */

// ============================================
// 9. УТИЛИТАРНЫЕ HOOKS
// ============================================

/**
 * Hook для debounce изменений размера экрана
 * Полезно чтобы избежать слишком частых ререндеров
 */
export const useDebouncedDimensions = (delay: number = 300) => {
  const [debouncedDimensions, setDebouncedDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleChange = ({ window }: { window: ScaledSize }) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDebouncedDimensions(window);
      }, delay);
    };
    
    const subscription = Dimensions.addEventListener('change', handleChange);
    
    return () => {
      clearTimeout(timeoutId);
      subscription?.remove();
    };
  }, [delay]);
  
  return debouncedDimensions;
};

/**
 * Hook для проверки минимального размера экрана
 */
export const useMinWidth = (minWidth: number): boolean => {
  const { window } = useDimensions();
  return window.width >= minWidth;
};

/**
 * Hook для проверки максимального размера экрана
 */
export const useMaxWidth = (maxWidth: number): boolean => {
  const { window } = useDimensions();
  return window.width <= maxWidth;
};

/**
 * Примеры использования:
 * 
 * const MyComponent = () => {
 *   const isWideEnough = useMinWidth(768);  // Проверяем минимальную ширину для планшета
 *   const isCompact = useMaxWidth(375);     // Проверяем максимальную ширину для компактного режима
 *   
 *   return (
 *     <View>
 *       {isWideEnough && <SidePanel />}
 *       {isCompact && <CompactMode />}
 *     </View>
 *   );
 * };
 */

// ============================================
// ЭКСПОРТ
// ============================================

export default {
  useScreenSize,
  useOrientation,
  useIsLandscape,
  useAspectRatio,
  useDeviceType,
  useDimensions,
  useResponsiveValue,
  useFoldable,
  useDevice,
  useDebouncedDimensions,
  useMinWidth,
  useMaxWidth,
};

/**
 * ПОЛНЫЙ ПРИМЕР ИСПОЛЬЗОВАНИЯ В КОМПОНЕНТЕ:
 * 
 * import { useDevice, useResponsiveValue } from '@/hooks/useResponsive';
 * 
 * const VocabularyListScreen = () => {
 *   const device = useDevice();
 *   
 *   const padding = useResponsiveValue({
 *     small: 12,
 *     medium: 16,
 *     tablet: 24,
 *     default: 16,
 *   });
 *   
 *   const columns = device.isTablet ? 2 : 1;
 *   
 *   return (
 *     <View style={{ padding }}>
 *       <FlatList
 *         data={vocabularies}
 *         numColumns={columns}
 *         key={`columns-${columns}`}
 *         renderItem={({ item }) => (
 *           <VocabularyCard vocabulary={item} />
 *         )}
 *       />
 *     </View>
 *   );
 * };
 */