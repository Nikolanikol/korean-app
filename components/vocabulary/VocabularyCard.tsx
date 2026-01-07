import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { Vocabulary } from "@/types/vocabulary";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  onPress: () => void;
}

export function VocabularyCard({ vocabulary, onPress }: VocabularyCardProps) {
  const getDifficultyStyle = (level?: string) => {
    switch (level) {
      case "beginner":
        return { bg: Colors.green[100], text: Colors.green[800] };
      case "intermediate":
        return { bg: Colors.yellow[100], text: Colors.yellow[800] };
      case "advanced":
        return { bg: Colors.red[200], text: Colors.red[600] };
      default:
        return { bg: Colors.gray[100], text: Colors.gray[800] };
    }
  };

  const difficultyLabels = {
    beginner: "Начальный",
    intermediate: "Средний",
    advanced: "Продвинутый",
  };

  const difficultyStyle = getDifficultyStyle(vocabulary.difficultyLevel);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{vocabulary.title}</Text>
          {vocabulary.isOfficial && (
            <View style={styles.officialBadge}>
              <Text style={styles.officialBadgeText}>Официальный</Text>
            </View>
          )}
        </View>
        {vocabulary.difficultyLevel && (
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyStyle.bg },
            ]}
          >
            <Text
              style={[styles.difficultyText, { color: difficultyStyle.text }]}
            >
              {difficultyLabels[vocabulary.difficultyLevel]}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      {vocabulary.description && (
        <Text style={styles.description} numberOfLines={2}>
          {vocabulary.description}
        </Text>
      )}

      {/* Tags */}
      {vocabulary.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {vocabulary.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statText}>📚 {vocabulary.wordCount} слов</Text>
        {vocabulary.isPublic && (
          <>
            <Text style={styles.statText}>
              👥 {vocabulary.studyCount} изучают
            </Text>
            <Text style={styles.statText}>🔄 {vocabulary.forkCount}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  officialBadge: {
    backgroundColor: Colors.primary + "20",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  officialBadgeText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  difficultyText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  description: {
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    fontSize: Typography.fontSize.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.xs,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  statText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
  },
});
