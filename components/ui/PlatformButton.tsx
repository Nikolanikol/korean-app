import { Colors } from "@/constants";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface PlatformButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Универсальная кнопка с платформо-специфичными стилями
 *
 * iOS:
 * - Скругленные углы (borderRadius: 10-12)
 * - Тонкая тень (shadowOpacity: 0.1)
 * - Semibold текст (fontWeight: 600)
 * - Меньший padding
 *
 * Android:
 * - Менее скругленные углы (borderRadius: 6-8)
 * - Material elevation
 * - Medium текст (fontWeight: 500)
 * - Ripple эффект
 */
export const PlatformButton: React.FC<PlatformButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  // Размеры
  const sizeStyles = {
    small: {
      paddingVertical: isIOS ? 8 : 10,
      paddingHorizontal: isIOS ? 16 : 20,
      fontSize: isIOS ? 15 : 14,
      borderRadius: isIOS ? 8 : 6,
    },
    medium: {
      paddingVertical: isIOS ? 12 : 14,
      paddingHorizontal: isIOS ? 20 : 24,
      fontSize: isIOS ? 17 : 16,
      borderRadius: isIOS ? 10 : 8,
    },
    large: {
      paddingVertical: isIOS ? 16 : 18,
      paddingHorizontal: isIOS ? 24 : 28,
      fontSize: isIOS ? 19 : 18,
      borderRadius: isIOS ? 12 : 10,
    },
  };

  const currentSize = sizeStyles[size];

  // Стили для iOS
  const iOSStyles = StyleSheet.create({
    button: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: disabled ? 0 : 0.1,
      shadowRadius: 4,
    },
  });

  // Стили для Android
  const androidStyles = StyleSheet.create({
    button: {
      elevation: disabled ? 0 : 4,
    },
  });

  // Варианты кнопок
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          button: {
            backgroundColor: disabled ? Colors.gray[300] : Colors.primary,
          },
          text: {
            color: disabled ? Colors.gray[500] : Colors.white,
          },
        };

      case "secondary":
        return {
          button: {
            backgroundColor: disabled ? Colors.gray[200] : Colors.secondary,
          },
          text: {
            color: disabled ? Colors.gray[500] : Colors.white,
          },
        };

      case "outlined":
        return {
          button: {
            backgroundColor: "transparent",
            borderWidth: isIOS ? 1.5 : 2,
            borderColor: disabled ? Colors.gray[300] : Colors.primary,
          },
          text: {
            color: disabled ? Colors.gray[500] : Colors.primary,
          },
        };

      case "text":
        return {
          button: {
            backgroundColor: "transparent",
            paddingVertical: currentSize.paddingVertical / 2,
          },
          text: {
            color: disabled ? Colors.gray[500] : Colors.primary,
          },
        };

      default:
        return {
          button: {},
          text: {},
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          borderRadius: currentSize.borderRadius,
        },
        variantStyles.button,
        isIOS && iOSStyles.button,
        isAndroid && androidStyles.button,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      // Android ripple эффект
      {...(isAndroid && {
        android_ripple: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      })}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize: currentSize.fontSize,
              fontWeight: isIOS ? "600" : "500",
            },
            variantStyles.text,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  text: {
    textAlign: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
    width: "100%",
  },
  disabled: {
    opacity: 0.6,
  },
});

// Примеры использования:

/**
 * Primary button:
 * <PlatformButton
 *   title="Сохранить"
 *   onPress={handleSave}
 *   variant="primary"
 *   size="medium"
 * />
 *
 * Secondary button:
 * <PlatformButton
 *   title="Отмена"
 *   onPress={handleCancel}
 *   variant="secondary"
 *   size="medium"
 * />
 *
 * Outlined button:
 * <PlatformButton
 *   title="Узнать больше"
 *   onPress={handleLearnMore}
 *   variant="outlined"
 *   size="medium"
 * />
 *
 * Text button:
 * <PlatformButton
 *   title="Пропустить"
 *   onPress={handleSkip}
 *   variant="text"
 *   size="small"
 * />
 *
 * Loading state:
 * <PlatformButton
 *   title="Загрузка..."
 *   onPress={handleSubmit}
 *   loading={isLoading}
 * />
 *
 * Full width:
 * <PlatformButton
 *   title="Продолжить"
 *   onPress={handleContinue}
 *   fullWidth
 * />
 */

export default PlatformButton;
