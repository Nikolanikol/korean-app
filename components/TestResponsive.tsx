import { Colors } from "@/constants";
import { useDevice } from "@/hooks/useResponsive";
import { FONT_SIZES, scale, SPACING } from "@/utils/responsive";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const TestResponsive = () => {
  const device = useDevice();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Тест адаптивности</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Устройство:</Text>
        <Text style={styles.value}>
          {device.deviceType} ({device.width.toFixed(0)}x
          {device.height.toFixed(0)})
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Размер экрана:</Text>
        <Text style={styles.value}>
          {device.isSmall && "📱 Маленький"}
          {device.isMedium && "📱 Средний"}
          {device.isTablet && "📱 Планшет"}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Ориентация:</Text>
        <Text style={styles.value}>
          {device.orientation === "portrait"
            ? "⬆️ Вертикальная"
            : "↔️ Горизонтальная"}
        </Text>
      </View>

      <Text style={[styles.adaptiveText, { fontSize: FONT_SIZES.base }]}>
        Этот текст адаптивный!
        {device.isSmall && " (маленький)"}
        {device.isTablet && " (большой для планшета)"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(16), // Адаптивный padding!
    backgroundColor: Colors.white,
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: SPACING.md,
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  label: {
    fontSize: FONT_SIZES.base,
    color: Colors.text.secondary,
  },
  value: {
    fontSize: FONT_SIZES.base,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  adaptiveText: {
    marginTop: SPACING.lg,
    color: Colors.text.primary,
    textAlign: "center",
  },
});
