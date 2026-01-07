import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
import { Colors, Spacing, Typography } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { commonStyles } from "@/utils/commonStyles";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { vocabularies, isLoading, fetchVocabularies } = useVocabularyStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVocabularies();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVocabularies();
    setRefreshing(false);
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои словари</Text>
        {user && (
          <Text style={styles.headerSubtitle}>
            {user.totalWordsLearned} слов изучено • {user.streakDays} дней
            подряд 🔥
          </Text>
        )}
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/vocabulary/create")}
      >
        <Text style={styles.createButtonText}>+ Создать словарь</Text>
      </TouchableOpacity>

      {/* Vocabularies List */}
      <FlatList
        data={vocabularies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VocabularyCard
            vocabulary={item}
            onPress={() => router.push(`/vocabulary/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={[commonStyles.centered, styles.emptyContainer]}>
            <Text style={styles.emptyText}>
              {isLoading ? "Загрузка..." : "Нет словарей"}
            </Text>
            {!isLoading && (
              <Text style={styles.emptySubtext}>
                Создайте свой первый словарь{"\n"}или найдите готовые в
                библиотеке
              </Text>
            )}
          </View>
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
  headerTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
  },
  headerSubtitle: {
    color: Colors.white,
    opacity: 0.8,
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
  createButton: {
    backgroundColor: Colors.secondary,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  emptyContainer: {
    paddingVertical: 80,
  },
  emptyText: {
    color: Colors.gray[500],
    fontSize: Typography.fontSize.lg,
  },
  emptySubtext: {
    color: Colors.gray[400],
    marginTop: Spacing.sm,
    textAlign: "center",
    fontSize: Typography.fontSize.sm,
  },
});
