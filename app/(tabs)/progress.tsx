import { ActivityBar } from "@/components/profile/ActivityBar";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useProgressStore } from "@/store/progressStore";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { commonStyles } from "@/utils/commonStyles";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProgressScreen() {
  const { totalWordsLearned, currentStreak, longestStreak } =
    useProgressStore();
  const { vocabularies } = useVocabularyStore();

  const totalWords = vocabularies.reduce((sum, v) => sum + v.wordCount, 0);

  return (
    <ScrollView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📊</Text>
        <Text style={styles.headerTitle}>Ваш прогресс</Text>
        <Text style={styles.headerSubtitle}>
          Отслеживайте свой путь к успеху
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Дней подряд 🔥</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSecondary]}>
            <Text style={styles.statValue}>{totalWordsLearned}</Text>
            <Text style={styles.statLabel}>Слов изучено</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={styles.statValue}>{vocabularies.length}</Text>
            <Text style={styles.statLabel}>Словарей</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={styles.statValue}>{totalWords}</Text>
            <Text style={styles.statLabel}>Всего слов</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Рекорд подряд 🏆</Text>
          </View>
        </View>
      </View>

      {/* Activity Bar */}
      <View style={styles.section}>
        <ActivityBar />
      </View>

      {/* Future: Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Достижения</Text>
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonEmoji}>🏆</Text>
          <Text style={styles.comingSoonText}>
            Скоро здесь появятся ваши достижения!
          </Text>
        </View>
      </View>
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
  statsContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  statCardPrimary: {
    backgroundColor: Colors.card,
  },
  statCardSecondary: {
    backgroundColor: Colors.card,
  },
  statCardPurple: {
    backgroundColor: Colors.card,
  },
  statCardOrange: {
    backgroundColor: Colors.card,
  },
  statCardGreen: {
    backgroundColor: Colors.card,
  },
  statValue: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  comingSoon: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  comingSoonEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  comingSoonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
