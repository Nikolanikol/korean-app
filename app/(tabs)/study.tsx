import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useProgressStore } from "@/store/progressStore";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { commonStyles } from "@/utils/commonStyles";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StudyScreen() {
  const router = useRouter();
  const { vocabularies, fetchVocabularies } = useVocabularyStore();
  const { getDueWords, totalWordsLearned } = useProgressStore();

  useEffect(() => {
    fetchVocabularies();
  }, []);

  // Получаем все слова на повторение
  const allDueWords = getDueWords();

  return (
    <ScrollView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🎯</Text>
        <Text style={styles.headerTitle}>Изучение</Text>
        <Text style={styles.headerSubtitle}>
          {allDueWords.length > 0
            ? `${allDueWords.length} слов ждут повторения`
            : "Все слова повторены! 🎉"}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>{allDueWords.length}</Text>
          <Text style={styles.quickStatLabel}>На повторение</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>{totalWordsLearned}</Text>
          <Text style={styles.quickStatLabel}>Изучено</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>{vocabularies.length}</Text>
          <Text style={styles.quickStatLabel}>Словарей</Text>
        </View>
      </View>

      {/* My Vocabularies with Exercise Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Мои словари</Text>

        {vocabularies.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyText}>
              У вас пока нет словарей для изучения
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.emptyButtonText}>Перейти к словарям</Text>
            </TouchableOpacity>
          </View>
        ) : (
          vocabularies.map((vocabulary) => {
            const dueWordsCount = getDueWords(vocabulary.id).length;

            return (
              <View key={vocabulary.id} style={styles.vocabularyCard}>
                {/* Vocabulary Info */}
                <TouchableOpacity
                  onPress={() => router.push(`/vocabulary/${vocabulary.id}`)}
                >
                  <Text style={styles.vocabularyTitle}>{vocabulary.title}</Text>
                  {vocabulary.description && (
                    <Text style={styles.vocabularyDescription}>
                      {vocabulary.description}
                    </Text>
                  )}
                  <View style={styles.vocabularyMeta}>
                    <Text style={styles.vocabularyMetaText}>
                      📚 {vocabulary.wordCount} слов
                    </Text>
                    {dueWordsCount > 0 && (
                      <Text style={styles.vocabularyDue}>
                        🔔 {dueWordsCount} на повторение
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Exercise Buttons */}
                <View style={styles.exerciseButtons}>
                  <TouchableOpacity
                    style={[
                      styles.exerciseButton,
                      styles.exerciseButtonPrimary,
                    ]}
                    onPress={() =>
                      router.push(`/study/flashcards/${vocabulary.id}`)
                    }
                  >
                    <Text style={styles.exerciseButtonEmoji}>🎴</Text>
                    <Text style={styles.exerciseButtonText}>FlashCards</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.exerciseButton,
                      styles.exerciseButtonSecondary,
                    ]}
                    onPress={() =>
                      router.push(`/exercise/multiple-choice/${vocabulary.id}`)
                    }
                  >
                    <Text style={styles.exerciseButtonEmoji}>📝</Text>
                    <Text style={styles.exerciseButtonText}>Quiz</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Quick Start (if have due words) */}
      {allDueWords.length > 0 && vocabularies.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Быстрый старт</Text>
          <TouchableOpacity
            style={styles.quickStartButton}
            onPress={() =>
              router.push(`/exercise/multiple-choice/${vocabularies[0].id}`)
            }
          >
            <View style={styles.quickStartContent}>
              <View>
                <Text style={styles.quickStartTitle}>
                  ⚡ Повторить все слова
                </Text>
                <Text style={styles.quickStartSubtitle}>
                  {allDueWords.length} слов из всех словарей
                </Text>
              </View>
              <Text style={styles.quickStartArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    color: Colors.white,
    opacity: 0.9,
    fontSize: Typography.fontSize.sm,
  },
  quickStats: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  quickStat: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  quickStatValue: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  quickStatLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  vocabularyCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  vocabularyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  vocabularyDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  vocabularyMeta: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  vocabularyMetaText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  vocabularyDue: {
    fontSize: Typography.fontSize.xs,
    color: Colors.orange[600],
    fontWeight: Typography.fontWeight.semibold,
  },
  exerciseButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  exerciseButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  exerciseButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  exerciseButtonSecondary: {
    backgroundColor: Colors.secondary,
  },
  exerciseButtonEmoji: {
    fontSize: 18,
  },
  exerciseButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  emptyState: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  quickStartButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  quickStartContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quickStartTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  quickStartSubtitle: {
    color: Colors.white,
    opacity: 0.9,
    fontSize: Typography.fontSize.sm,
  },
  quickStartArrow: {
    color: Colors.white,
    fontSize: Typography.fontSize["2xl"],
  },
});
