import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useSettingsStore } from "@/store/settingsStore";
import { Language } from "@/types/settings";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  type: "interface" | "learning";
}

const LANGUAGES = {
  ru: { name: "Русский", flag: "🇷🇺" },
  en: { name: "English", flag: "🇬🇧" },
  ko: { name: "한국어", flag: "🇰🇷" },
};

export function LanguageModal({ visible, onClose, type }: LanguageModalProps) {
  const { settings, setInterfaceLanguage, setLearningLanguage } =
    useSettingsStore();
  const [tempLang, setTempLang] = useState<Language>(
    type === "interface"
      ? settings.interfaceLanguage
      : settings.learningLanguage
  );

  const handleSave = () => {
    if (type === "interface") {
      setInterfaceLanguage(tempLang);
    } else {
      setLearningLanguage(tempLang);
    }
    onClose();
  };

  const title = type === "interface" ? "Язык интерфейса" : "Изучаемый язык";
  const subtitle =
    type === "interface"
      ? "На каком языке отображать приложение?"
      : "Какой язык вы хотите изучать?";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.options}>
            {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.option,
                  tempLang === lang && styles.optionActive,
                ]}
                onPress={() => setTempLang(lang)}
              >
                <Text style={styles.flag}>{LANGUAGES[lang].flag}</Text>
                <Text
                  style={[
                    styles.optionText,
                    tempLang === lang && styles.optionTextActive,
                  ]}
                >
                  {LANGUAGES[lang].name}
                </Text>
                {tempLang === lang && <Text style={styles.checkmark}>✓</Text>}
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
  options: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  optionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  flag: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  optionTextActive: {
    color: Colors.primary,
  },
  checkmark: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
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
