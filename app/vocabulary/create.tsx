import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { DifficultyLevel } from "@/types/vocabulary";
import { commonStyles } from "@/utils/commonStyles";
import { zodResolver } from "@hookform/resolvers/zod"; // ⬅️ ДОБАВИЛИ
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form"; // ⬅️ ДОБАВИЛИ
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
// ⬇️ ДОБАВЛЯЕМ СХЕМУ ВАЛИДАЦИИ
const vocabularySchema = z.object({
  title: z.string().min(1, "Название обязательно").min(3, "Минимум 3 символа"),
  description: z
    .string()
    .min(1, "Описание обязательно")
    .min(10, "Минимум 10 символов"),
  category: z.string().min(1, "Категория обязательна"),
  tags: z
    .string()
    .min(1, "Добавьте хотя бы один тег")
    .transform((val) => {
      // Стандартизация тегов
      return val
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .join(", ");
    }),
});
type VocabularyFormData = z.infer<typeof vocabularySchema>;

export default function CreateVocabularyScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createVocabulary, isLoading } = useVocabularyStore();

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VocabularyFormData>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
    },
  });

  // Остальные состояния (не входят в форму)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [isPublic, setIsPublic] = useState(true);

  // Watch для preview тегов
  const tagsValue = watch("tags");

  // Состояние для списка слов
  const [words, setWords] = useState<
    Array<{
      id: string;
      korean: string;
      translation: string;
      romanization?: string;
      exampleSentence?: string;
      exampleTranslation?: string;
      tags: string[];
      partOfSpeech?: string;
    }>
  >([]);

  // Состояние для формы добавления слова
  const [newWord, setNewWord] = useState({
    korean: "",
    translation: "",

    exampleSentence: "",
    exampleTranslation: "",
  });

  // Функция для добавления слова в список
  const handleAddWord = () => {
    if (!newWord.korean.trim() || !newWord.translation.trim()) {
      Alert.alert("Ошибка", "Корейское слово и перевод обязательны");
      return;
    }

    // Добавляем слово в список
    setWords([
      ...words,
      {
        id: `word-${Date.now()}-${words.length}`, // ⬅️ Уникальный ID!
        korean: newWord.korean.trim(),
        translation: newWord.translation.trim(),

        exampleSentence: newWord.exampleSentence.trim() || undefined,
        exampleTranslation: newWord.exampleTranslation.trim() || undefined,
        tags: [],
        partOfSpeech: "noun",
      },
    ]);

    // Очищаем форму
    setNewWord({
      korean: "",
      translation: "",

      exampleSentence: "",
      exampleTranslation: "",
    });

    Alert.alert("Успех", "Слово добавлено!");
  };

  // Функция для удаления слова из списка
  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };
  const onSubmit = async (data: VocabularyFormData) => {
    // Проверяем наличие слов
    if (words.length === 0) {
      Alert.alert("Ошибка", "Добавьте хотя бы одно слово");
      return;
    }

    if (!user) {
      Alert.alert("Ошибка", "Необходимо войти в систему");
      return;
    }

    try {
      // Парсим стандартизированные теги
      const parsedTags = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createVocabulary({
        userId: user.id,
        title: data.title,
        description: data.description,
        language: "ko",
        difficultyLevel: difficulty,
        category: data.category,
        tags: parsedTags,
        isPublic,
        isOfficial: false,
        wordCount: words.length,
        forkCount: 0,
        studyCount: 0,
        words: words,
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
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Например: Базовые фразы"
                style={[commonStyles.input, errors.title && styles.inputError]}
                placeholderTextColor={Colors.gray[400]}
              />
            )}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title.message}</Text>
          )}
        </View>

        {/* Описание */}
        <View style={styles.field}>
          <Text style={styles.label}>Описание *</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Краткое описание словаря..."
                multiline
                numberOfLines={3}
                style={[
                  commonStyles.input,
                  styles.textArea,
                  errors.description && styles.inputError,
                ]}
                placeholderTextColor={Colors.gray[400]}
                textAlignVertical="top"
              />
            )}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description.message}</Text>
          )}
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
          <Text style={styles.label}>Категория *</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Например: еда, путешествия, бизнес"
                style={[
                  commonStyles.input,
                  errors.category && styles.inputError,
                ]}
                placeholderTextColor={Colors.gray[400]}
              />
            )}
          />
          {errors.category && (
            <Text style={styles.errorText}>{errors.category.message}</Text>
          )}
        </View>

        {/* Теги */}
        <View style={styles.field}>
          <Text style={styles.label}>Теги (через запятую) *</Text>
          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="topik, грамматика, разговорный"
                style={[commonStyles.input, errors.tags && styles.inputError]}
                placeholderTextColor={Colors.gray[400]}
              />
            )}
          />
          {errors.tags && (
            <Text style={styles.errorText}>{errors.tags.message}</Text>
          )}
          {tagsValue && tagsValue.trim() && (
            <View style={styles.tagsPreview}>
              <Text style={styles.tagsPreviewLabel}>Будут сохранены как:</Text>
              <View style={styles.tagsPreviewContainer}>
                {tagsValue
                  .split(",")
                  .map((t) => t.trim().toLowerCase())
                  .filter(Boolean)
                  .map((tag, index) => (
                    <View key={index} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{tag}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>
        {/* Список добавленных слов */}
        {words.length > 0 && (
          <View style={styles.wordsList}>
            <Text style={styles.wordsListTitle}>
              ✅ Добавлено слов: {words.length}
            </Text>

            {words.map((word, index) => (
              <View key={index} style={styles.wordItem}>
                <View style={styles.wordContent}>
                  <Text style={styles.wordKorean}>{word.korean}</Text>
                  <Text style={styles.wordTranslation}>{word.translation}</Text>
                  {word.romanization && (
                    <Text style={styles.wordRomanization}>
                      {word.romanization}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleRemoveWord(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {/* ========== СЕКЦИЯ ДОБАВЛЕНИЯ СЛОВ ========== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Слова ({words.length})</Text>

          {/* Форма добавления слова */}
          <View style={styles.wordForm}>
            <Text style={styles.label}>Корейское слово *</Text>
            <TextInput
              style={styles.input}
              value={newWord.korean}
              onChangeText={(text) => setNewWord({ ...newWord, korean: text })}
              placeholder="예: 안녕하세요"
              placeholderTextColor={Colors.gray[400]}
            />

            <Text style={styles.label}>Перевод *</Text>
            <TextInput
              style={styles.input}
              value={newWord.translation}
              onChangeText={(text) =>
                setNewWord({ ...newWord, translation: text })
              }
              placeholder="Здравствуйте"
              placeholderTextColor={Colors.gray[400]}
            />

            <TouchableOpacity
              style={styles.addWordButton}
              onPress={handleAddWord}
            >
              <Text style={styles.addWordButtonText}>+ Добавить слово</Text>
            </TouchableOpacity>
          </View>
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
          onPress={handleSubmit(onSubmit)}
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
  // Стили для секции добавления слов
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  wordForm: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  addWordButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  addWordButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  wordsList: {
    marginTop: Spacing.md,
  },
  wordsListTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  wordItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  wordContent: {
    flex: 1,
  },
  wordKorean: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  wordTranslation: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  wordRomanization: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[500],
    fontStyle: "italic",
  },
  removeButton: {
    padding: Spacing.sm,
  },
  removeButtonText: {
    fontSize: 20,
  },
  inputError: {
    borderColor: Colors.red[500],
    borderWidth: 2,
  },
  errorText: {
    color: Colors.red[500],
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs,
  },
  tagsPreview: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
  },
  tagsPreviewLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  tagsPreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  tagChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tagChipText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
});
