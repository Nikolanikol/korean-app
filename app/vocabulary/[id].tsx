import { WordItem } from "@/components/vocabulary/WordItem";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { commonStyles } from "@/utils/commonStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function VocabularyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedVocabulary, isLoading, fetchVocabularyById } =
    useVocabularyStore();

  useEffect(() => {
    if (id) {
      fetchVocabularyById(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!selectedVocabulary) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <Text style={styles.errorText}>Словарь не найден</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedVocabulary.title}</Text>
        {selectedVocabulary.description && (
          <Text style={styles.headerDescription}>
            {selectedVocabulary.description}
          </Text>
        )}
      </View>

      {/* Study Button */}
      <TouchableOpacity
        style={styles.studyButton}
        onPress={() => router.push(`/study/flashcards/${id}`)}
      >
        <Text style={styles.studyButtonText}>🎯 Начать изучение</Text>
      </TouchableOpacity>
      {/* Multiple Choice кнопка */}
      <TouchableOpacity
        style={[styles.studyButton, { backgroundColor: Colors.secondary }]}
        onPress={() => router.push(`/exercise/multiple-choice/${id}`)}
      >
        <Text style={styles.studyButtonText}>📝 Multiple Choice</Text>
      </TouchableOpacity>
      {/* Words List */}
      <FlatList
        data={selectedVocabulary.words}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WordItem word={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.listHeader}>
            Слова ({selectedVocabulary.wordCount})
          </Text>
        }
      />
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
  backButton: {
    color: Colors.white,
    marginBottom: Spacing.md,
    fontSize: Typography.fontSize.base,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
  },
  headerDescription: {
    color: Colors.white,
    opacity: 0.8,
    marginTop: Spacing.sm,
    fontSize: Typography.fontSize.sm,
  },
  studyButton: {
    backgroundColor: Colors.secondary,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  studyButtonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  listContent: {
    padding: Spacing.lg,
  },
  listHeader: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
    fontSize: Typography.fontSize.base,
  },
  errorText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
  },
});
