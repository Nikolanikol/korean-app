import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useSettingsStore } from "@/store/settingsStore";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuestionsPerRoundModalProps {
  visible: boolean;
  onClose: () => void;
}

export function QuestionsPerRoundModal({
  visible,
  onClose,
}: QuestionsPerRoundModalProps) {
  const { settings, setQuestionsPerRound } = useSettingsStore();
  const [tempValue, setTempValue] = useState(settings.questionsPerRound);

  const handleSave = () => {
    setQuestionsPerRound(tempValue);
    onClose();
  };

  const quickValues = [5, 10, 15, 20, 30];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Вопросов за раунд</Text>
          <Text style={styles.subtitle}>
            Сколько вопросов показывать в одном упражнении Multiple Choice
          </Text>

          {/* Current Value */}
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{tempValue}</Text>
            <Text style={styles.valueLabel}>вопросов</Text>
          </View>

          {/* Slider */}
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={30}
            step={1}
            value={tempValue}
            onValueChange={setTempValue}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.gray[300]}
            thumbTintColor={Colors.primary}
          />

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>5</Text>
            <Text style={styles.sliderLabel}>30</Text>
          </View>

          {/* Quick Select */}
          <View style={styles.quickSelect}>
            {quickValues.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickButton,
                  tempValue === value && styles.quickButtonActive,
                ]}
                onPress={() => setTempValue(value)}
              >
                <Text
                  style={[
                    styles.quickButtonText,
                    tempValue === value && styles.quickButtonTextActive,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonCancelText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
            >
              <Text style={styles.buttonSaveText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: "85%",
    maxWidth: 400,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xl,
  },
  valueContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  valueText: {
    fontSize: Typography.fontSize["4xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  valueLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  sliderLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  quickSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  quickButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    alignItems: "center",
  },
  quickButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  quickButtonTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
  buttons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: Colors.gray[100],
  },
  buttonCancelText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  buttonSave: {
    backgroundColor: Colors.primary,
  },
  buttonSaveText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
