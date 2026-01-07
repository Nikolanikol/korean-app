import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import {
  mockVocabularies,
  mockWordProgress,
  mockWords,
} from "@/mocks/vocabularies.mock";
import { useAuthStore } from "@/store/authStore";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { WordProgress } from "@/types/study";
import { Word } from "@/types/vocabulary";
import { commonStyles } from "@/utils/commonStyles";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DueWord {
  word: Word;
  progress: WordProgress;
  vocabularyTitle: string;
}

export default function StudyScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { vocabularies } = useVocabularyStore();
  const [dueWords, setDueWords] = useState<DueWord[]>([]);

  useEffect(() => {
    const today = new Date();
    const due = mockWordProgress
      .filter((p) => new Date(p.nextReviewDate) <= today)
      .map((progress) => {
        const word = mockWords.find((w) => w.id === progress.wordId);
        const vocab = mockVocabularies.find((v) => v.id === word?.vocabularyId);
        return {
          word: word!,
          progress,
          vocabularyTitle: vocab?.title || "Словарь",
        };
      })
      .filter((item) => item.word);

    setDueWords(due);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  const statusConfig = {
    new: {
      bg: Colors.green[100],
      text: Colors.green[800],
      label: "Новое",
      emoji: "✨",
    },
    learning: {
      bg: Colors.yellow[100],
      text: Colors.yellow[800],
      label: "Учу",
      emoji: "📖",
    },
    reviewing: {
      bg: Colors.blue[100],
      text: Colors.blue[800],
      label: "Повтор",
      emoji: "🔄",
    },
    mastered: {
      bg: Colors.blue[100],
      text: Colors.blue[800],
      label: "Изучено",
      emoji: "✅",
    },
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user?.username || "Друг"}! 👋
        </Text>
        <Text style={styles.headerTitle}>Время учить корейский</Text>
        <Text style={styles.headerSubtitle}>
          {dueWords.length === 0
            ? "Сегодня все выучено! 🎉"
            : `${dueWords.length} ${
                dueWords.length === 1 ? "слово ждет" : "слов ждут"
              } повторения`}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: Colors.green[50] }]}
            >
              <Text style={styles.statEmoji}>✨</Text>
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Новых слов</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: Colors.yellow[50] }]}
            >
              <Text style={styles.statEmoji}>📖</Text>
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>На повторение</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: Colors.blue[50] }]}
            >
              <Text style={styles.statEmoji}>✅</Text>
            </View>
            <Text style={styles.statValue}>25</Text>
            <Text style={styles.statLabel}>Изучено сегодня</Text>
          </View>
        </View>

        {/* Quick Actions */}
        {dueWords.length > 0 && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={() => router.push("/study/flashcards/vocab-1")}
            >
              <View style={styles.actionContent}>
                <View>
                  <Text style={styles.actionTitle}>🎯 Начать изучение</Text>
                  <Text style={styles.actionSubtitle}>
                    {dueWords.length} карточек ждут тебя
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryAction}>
                <Text style={styles.secondaryActionEmoji}>🎲</Text>
                <Text style={styles.secondaryActionText}>Случайные слова</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryAction}>
                <Text style={styles.secondaryActionEmoji}>⚡</Text>
                <Text style={styles.secondaryActionText}>Быстрый тест</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Daily Progress */}
        <View style={styles.progressSection}>
          <View style={commonStyles.rowBetween}>
            <Text style={styles.sectionTitle}>Ежедневная цель</Text>
            <Text style={styles.progressText}>12 / 20 слов</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "60%" }]} />
          </View>
          <Text style={styles.progressHint}>
            Еще 8 слов до выполнения цели 💪
          </Text>
        </View>

        {/* Due Words List */}
        {dueWords.length > 0 ? (
          <View style={styles.wordsSection}>
            <Text style={styles.sectionTitle}>Слова на сегодня</Text>
            {dueWords.map((item, index) => {
              const status = statusConfig[item.progress.status];
              return (
                <View key={item.word.id} style={styles.wordCard}>
                  <View style={styles.wordCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.wordKorean}>{item.word.korean}</Text>
                      <Text style={styles.wordTranslation}>
                        {item.word.translation}
                      </Text>
                      <Text style={styles.wordVocabulary}>
                        из "{item.vocabularyTitle}"
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: status.bg },
                      ]}
                    >
                      <Text style={styles.statusEmoji}>{status.emoji}</Text>
                      <Text style={[styles.statusText, { color: status.text }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  {/* Progress bar for this word */}
                  <View style={styles.wordProgressContainer}>
                    <View style={styles.wordProgressBar}>
                      <View
                        style={[
                          styles.wordProgressFill,
                          {
                            width: `${
                              (item.progress.correctCount /
                                (item.progress.totalReviews || 1)) *
                              100
                            }%`,
                            backgroundColor: status.text,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.wordProgressText}>
                      {item.progress.correctCount} /{" "}
                      {item.progress.totalReviews} правильно
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          /* Empty State */
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>Все выучено!</Text>
            <Text style={styles.emptyText}>
              Сегодня нет слов на повторение.{"\n"}
              Отличная работа! Возвращайся завтра.
            </Text>

            <TouchableOpacity
              style={styles.emptyAction}
              onPress={() => router.push("/(tabs)/library")}
            >
              <Text style={styles.emptyActionText}>Найти новые словари 🌐</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Study Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakValue}>
                {user?.streakDays || 0} дней
              </Text>
              <Text style={styles.streakLabel}>Серия обучения</Text>
            </View>
          </View>
          <Text style={styles.streakHint}>
            Продолжай в том же духе! Изучай хотя бы одно слово каждый день.
          </Text>
        </View>

        {/* Vocabulary Recommendations */}
        {vocabularies.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Рекомендуемые словари</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsContent}
            >
              {vocabularies.slice(0, 3).map((vocab) => (
                <TouchableOpacity
                  key={vocab.id}
                  style={styles.recommendationCard}
                  onPress={() => router.push(`/vocabulary/${vocab.id}`)}
                >
                  <Text style={styles.recommendationTitle} numberOfLines={2}>
                    {vocab.title}
                  </Text>
                  <Text style={styles.recommendationWords}>
                    📚 {vocab.wordCount} слов
                  </Text>
                  {vocab.isOfficial && (
                    <View style={styles.recommendationBadge}>
                      <Text style={styles.recommendationBadgeText}>
                        ⭐ Официальный
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: Spacing.lg,
  },
  greeting: {
    color: Colors.white,
    opacity: 0.9,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    color: Colors.white,
    opacity: 0.8,
    fontSize: Typography.fontSize.sm,
  },
  content: {
    padding: Spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  actionsContainer: {
    marginBottom: Spacing.xl,
  },
  primaryAction: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  actionSubtitle: {
    color: Colors.white,
    opacity: 0.9,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
  actionArrow: {
    color: Colors.white,
    fontSize: Typography.fontSize["2xl"],
  },
  secondaryActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  secondaryActionEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  secondaryActionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: "center",
  },
  progressSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.full,
  },
  progressHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  wordsSection: {
    marginBottom: Spacing.xl,
  },
  wordCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  wordCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
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
  wordVocabulary: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  statusEmoji: {
    fontSize: 14,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  wordProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  wordProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  wordProgressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  wordProgressText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl * 2,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  emptyAction: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  emptyActionText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  streakCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.yellow[100],
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  streakEmoji: {
    fontSize: 48,
  },
  streakValue: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  streakLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  streakHint: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  recommendationsSection: {
    marginBottom: Spacing.xl,
  },
  recommendationsContent: {
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  recommendationCard: {
    width: 160,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  recommendationTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  recommendationWords: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  recommendationBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
  },
  recommendationBadgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
});
