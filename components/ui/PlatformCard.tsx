import { BorderRadius, Colors, Spacing } from "@/constants";
import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface PlatformCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined" | "flat";
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Универсальная карточка с платформо-специфичными тенями
 *
 * iOS:
 * - Использует shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * - Более тонкие тени с меньшей непрозрачностью
 * - Больший borderRadius (12-16)
 * - backgroundColor всегда белый или системный
 *
 * Android:
 * - Использует elevation для Material Design
 * - Более выраженная тень с большей elevation
 * - Меньший borderRadius (8-12)
 * - Может использовать цветные тени в Material 3
 */
export const PlatformCard: React.FC<PlatformCardProps> = ({
  children,
  onPress,
  variant = "default",
  style,
  contentStyle,
}) => {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  // iOS тени для разных вариантов
  const iOSShadows = {
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    elevated: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    outlined: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    flat: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
  };

  // Android elevation для разных вариантов
  const androidElevations = {
    default: 4,
    elevated: 8,
    outlined: 0,
    flat: 0,
  };

  // Стили для разных вариантов
  const variantStyles = {
    default: {
      backgroundColor: Colors.white,
      borderWidth: 0,
    },
    elevated: {
      backgroundColor: Colors.white,
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: Colors.white,
      borderWidth: isIOS ? 1 : 1.5,
      borderColor: Colors.gray[200],
    },
    flat: {
      backgroundColor: Colors.gray[50],
      borderWidth: 0,
    },
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.card,
        variantStyles[variant],
        // iOS тени
        isIOS && iOSShadows[variant],
        // Android elevation
        isAndroid && {
          elevation: androidElevations[variant],
        },
        style,
      ]}
      // Android ripple для touchable
      {...(onPress &&
        isAndroid && {
          android_ripple: {
            color: "rgba(0, 0, 0, 0.05)",
            borderless: false,
          },
        })}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Platform.OS === "ios" ? BorderRadius.xl : BorderRadius.lg,
    overflow: "hidden",
  },
  content: {
    padding: Spacing.lg,
  },
});

// ============================================
// Специализированные варианты карточек
// ============================================

/**
 * Карточка словаря
 */
export const VocabularyCard: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}> = ({ children, onPress, style }) => {
  return (
    <PlatformCard
      variant="default"
      onPress={onPress}
      style={[
        {
          marginBottom: Spacing.md,
        },
        style,
      ]}
    >
      {children}
    </PlatformCard>
  );
};

/**
 * Карточка слова (для флэшкарт)
 */
export const WordCard: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  isFlipped?: boolean;
  style?: ViewStyle;
}> = ({ children, onPress, isFlipped, style }) => {
  return (
    <PlatformCard
      variant="elevated"
      onPress={onPress}
      style={[
        {
          minHeight: 200,
          justifyContent: "center",
          alignItems: "center",
          // iOS добавляет больше padding для больших карточек
          ...(Platform.OS === "ios" && {
            paddingVertical: Spacing.xl,
          }),
        },
        style,
      ]}
      contentStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </PlatformCard>
  );
};

/**
 * Карточка с информацией (info card)
 */
export const InfoCard: React.FC<{
  children: React.ReactNode;
  type?: "info" | "success" | "warning" | "error";
  style?: ViewStyle;
}> = ({ children, type = "info", style }) => {
  const typeColors = {
    info: Colors.blue[50],
    success: Colors.green[50],
    warning: Colors.yellow[50],
    error: Colors.red[50],
  };

  const typeBorders = {
    info: Colors.blue[200],
    success: Colors.green[200],
    warning: Colors.yellow[200],
    error: Colors.red[200],
  };

  return (
    <PlatformCard
      variant="flat"
      style={[
        {
          backgroundColor: typeColors[type],
          borderLeftWidth: Platform.OS === "ios" ? 3 : 4,
          borderLeftColor: typeBorders[type],
        },
        style,
      ]}
    >
      {children}
    </PlatformCard>
  );
};

/**
 * Список карточек (для библиотеки)
 */
export const LibraryCard: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  featured?: boolean;
  style?: ViewStyle;
}> = ({ children, onPress, featured, style }) => {
  return (
    <PlatformCard
      variant={featured ? "elevated" : "default"}
      onPress={onPress}
      style={[
        {
          marginBottom: Spacing.md,
          // Featured карточки более выделены на iOS
          ...(featured &&
            Platform.OS === "ios" && {
              borderWidth: 2,
              borderColor: Colors.primary,
            }),
        },
        style,
      ]}
    >
      {children}
    </PlatformCard>
  );
};

// ============================================
// Примеры использования
// ============================================

/**
 * Базовая карточка:
 *
 * <PlatformCard variant="default">
 *   <Text>Содержимое карточки</Text>
 * </PlatformCard>
 */

/**
 * Интерактивная карточка:
 *
 * <PlatformCard
 *   variant="elevated"
 *   onPress={() => console.log('Нажато')}
 * >
 *   <Text>Нажми меня</Text>
 * </PlatformCard>
 */

/**
 * Карточка с обводкой:
 *
 * <PlatformCard variant="outlined">
 *   <Text>Карточка с рамкой</Text>
 * </PlatformCard>
 */

/**
 * Карточка словаря:
 *
 * <VocabularyCard onPress={handleOpenVocabulary}>
 *   <Text style={styles.title}>Топик I</Text>
 *   <Text style={styles.subtitle}>500 слов</Text>
 * </VocabularyCard>
 */

/**
 * Флэшкарта:
 *
 * <WordCard
 *   onPress={handleFlip}
 *   isFlipped={isFlipped}
 * >
 *   <Text style={styles.korean}>안녕하세요</Text>
 * </WordCard>
 */

/**
 * Информационная карточка:
 *
 * <InfoCard type="success">
 *   <Text>✓ Словарь успешно создан</Text>
 * </InfoCard>
 */

export default PlatformCard;
