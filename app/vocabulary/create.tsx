import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { DifficultyLevel } from "@/types/vocabulary";
import { commonStyles } from "@/utils/commonStyles";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateVocabularyScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createVocabulary, isLoading } = useVocabularyStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Название обязательно");
      return;
    }

    if (!user) {
      Alert.alert("Ошибка", "Необходимо войти в систему");
      return;
    }

    try {
      await createVocabulary({
        userId: user.id,
        title: title.trim(),
        description: description.trim() || undefined,
        language: "ko",
        difficultyLevel: difficulty,
        category: category.trim() || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isPublic,
        isOfficial: false,
        wordCount: 0,
        forkCount: 0,
        studyCount: 0,
      });

      Alert.alert("Успех", "Словарь создан!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось создать словарь");
    }
  };

  const difficultyLevels: DifficultyLevel[] = [
    "beginner",
    "intermediate",
    "advanced",
  ];
  const difficultyLabels = {
    beginner: "Начальный",
    intermediate: "Средний",
    advanced: "Продвинутый",
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>← Отмена</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новый словарь</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Название */}
        <View style={styles.field}>
          <Text style={styles.label}>Название словаря *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Например: Базовые фразы"
            style={commonStyles.input}
            placeholderTextColor={Colors.gray[400]}
          />
        </View>

        {/* Описание */}
        <View style={styles.field}>
          <Text style={styles.label}>Описание</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Краткое описание словаря..."
            multiline
            numberOfLines={3}
            style={[commonStyles.input, styles.textArea]}
            placeholderTextColor={Colors.gray[400]}
            textAlignVertical="top"
          />
        </View>

        {/* Уровень сложности */}
        <View style={styles.field}>
          <Text style={styles.label}>Уровень сложности</Text>
          <View style={styles.difficultyContainer}>
            {difficultyLevels.map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setDifficulty(level)}
                style={[
                  styles.difficultyButton,
                  difficulty === level && styles.difficultyButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    difficulty === level && styles.difficultyTextActive,
                  ]}
                >
                  {difficultyLabels[level]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Категория */}
        <View style={styles.field}>
          <Text style={styles.label}>Категория</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Например: еда, путешествия, бизнес"
            style={commonStyles.input}
            placeholderTextColor={Colors.gray[400]}
          />
        </View>

        {/* Теги */}
        <View style={styles.field}>
          <Text style={styles.label}>Теги (через запятую)</Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="topik, грамматика, разговорный"
            style={commonStyles.input}
            placeholderTextColor={Colors.gray[400]}
          />
        </View>

        {/* Публичный доступ */}
        <TouchableOpacity
          onPress={() => setIsPublic(!isPublic)}
          style={styles.switchContainer}
        >
          <View style={[styles.switch, isPublic && styles.switchActive]}>
            <View
              style={[styles.switchThumb, isPublic && styles.switchThumbActive]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Публичный словарь</Text>
            <Text style={styles.switchDescription}>
              Другие пользователи смогут найти и скопировать ваш словарь
            </Text>
          </View>
        </TouchableOpacity>

        {/* Кнопка создания */}
        <TouchableOpacity
          onPress={handleCreate}
          disabled={isLoading}
          style={[
            styles.createButton,
            isLoading && styles.createButtonDisabled,
          ]}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? "Создание..." : "Создать словарь"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: Spacing.lg,
  },
  cancelButton: {
    color: Colors.white,
    marginBottom: Spacing.md,
    fontSize: Typography.fontSize.base,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    padding: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.xl,
  },
  label: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
    fontSize: Typography.fontSize.base,
  },
  textArea: {
    minHeight: 80,
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  difficultyButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  difficultyText: {
    textAlign: "center",
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.sm,
  },
  difficultyTextActive: {
    color: Colors.white,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    marginBottom: Spacing.xxxl,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray[300],
    marginRight: Spacing.md,
    justifyContent: "center",
  },
  switchActive: {
    backgroundColor: Colors.primary,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    marginLeft: 4,
  },
  switchThumbActive: {
    marginLeft: 24,
  },
  switchLabel: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.base,
  },
  switchDescription: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
  createButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.secondary,
  },
  createButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  createButtonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
});
