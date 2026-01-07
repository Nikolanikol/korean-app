import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { Word } from "@/types/vocabulary";
import { commonStyles } from "@/utils/commonStyles";
import { StyleSheet, Text, View } from "react-native";

interface WordItemProps {
  word: Word;
}

export function WordItem({ word }: WordItemProps) {
  return (
    <View style={styles.container}>
      <View style={commonStyles.rowBetween}>
        <View style={{ flex: 1 }}>
          <Text style={styles.korean}>{word.korean}</Text>
          {word.romanization && (
            <Text style={styles.romanization}>{word.romanization}</Text>
          )}
          <Text style={styles.translation}>{word.translation}</Text>
        </View>
        {word.partOfSpeech && (
          <View style={styles.partOfSpeechBadge}>
            <Text style={styles.partOfSpeechText}>{word.partOfSpeech}</Text>
          </View>
        )}
      </View>

      {word.exampleSentence && (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleSentence}>{word.exampleSentence}</Text>
          {word.exampleTranslation && (
            <Text style={styles.exampleTranslation}>
              {word.exampleTranslation}
            </Text>
          )}
        </View>
      )}

      {word.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {word.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  korean: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  romanization: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  translation: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  partOfSpeechBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  partOfSpeechText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xs,
  },
  exampleContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  exampleSentence: {
    color: Colors.text.primary,
    fontStyle: "italic",
    marginBottom: Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
  exampleTranslation: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
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
});
