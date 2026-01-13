import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useSettingsStore } from "@/store/settingsStore";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DailyGoalModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DailyGoalModal({ visible, onClose }: DailyGoalModalProps) {
  const { settings, setDailyGoal } = useSettingsStore();
  const [tempGoal, setTempGoal] = useState(settings.dailyGoal);

  const handleSave = () => {
    setDailyGoal(tempGoal);
    onClose();
  };

  const goalOptions = [5, 10, 15, 20, 30, 50];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Ежедневная цель</Text>
          <Text style={styles.subtitle}>
            Сколько новых слов вы хотите изучать каждый день?
          </Text>

          <View style={styles.goalDisplay}>
            <Text style={styles.goalNumber}>{tempGoal}</Text>
            <Text style={styles.goalLabel}>слов в день</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={50}
            step={5}
            value={tempGoal}
            onValueChange={setTempGoal}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.gray[300]}
            thumbTintColor={Colors.primary}
          />

          <View style={styles.quickOptions}>
            {goalOptions.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.quickOption,
                  tempGoal === goal && styles.quickOptionActive,
                ]}
                onPress={() => setTempGoal(goal)}
              >
                <Text
                  style={[
                    styles.quickOptionText,
                    tempGoal === goal && styles.quickOptionTextActive,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Сохранить</Text>
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
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  goalDisplay: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  goalNumber: {
    fontSize: 64,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  goalLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: Spacing.lg,
  },
  quickOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  quickOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  quickOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickOptionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  quickOptionTextActive: {
    color: Colors.white,
  },
  buttons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    textAlign: "center",
  },
  saveButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    textAlign: "center",
  },
});
