import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { mockVocabularies } from "@/mocks/vocabularies.mock";
import { Vocabulary } from "@/types/vocabulary";
import { commonStyles } from "@/utils/commonStyles";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SortOption = "popular" | "newest" | "alphabetical";

export default function LibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);

  const categories = [
    { id: "all", label: "Все", emoji: "📚" },
    { id: "phrases", label: "Фразы", emoji: "💬" },
    { id: "food", label: "Еда", emoji: "🍜" },
    { id: "exam", label: "Экзамен", emoji: "📝" },
    { id: "grammar", label: "Грамматика", emoji: "📖" },
    { id: "travel", label: "Путешествия", emoji: "✈️" },
  ];

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "popular", label: "Популярные" },
    { id: "newest", label: "Новые" },
    { id: "alphabetical", label: "По алфавиту" },
  ];

  useEffect(() => {
    // Фильтруем только публичные словари
    let filtered = mockVocabularies.filter((v) => v.isPublic);

    // Поиск
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Категория
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (v) => v.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Сортировка
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.studyCount - a.studyCount;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setVocabularies(sorted);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Библиотека словарей</Text>
        <Text style={styles.headerSubtitle}>
          Найдите готовые наборы для изучения
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Поиск словарей, тегов..."
            style={styles.searchInput}
            placeholderTextColor={Colors.gray[400]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => {
            const isSelected =
              cat.id === "all"
                ? !selectedCategory
                : selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() =>
                  setSelectedCategory(cat.id === "all" ? null : cat.id)
                }
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort & Stats */}
      <View style={styles.statsBar}>
        <Text style={styles.resultsText}>
          {vocabularies.length}{" "}
          {vocabularies.length === 1 ? "словарь" : "словарей"}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortContainer}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSortBy(option.id)}
              style={[
                styles.sortChip,
                sortBy === option.id && styles.sortChipActive,
              ]}
            >
              <Text
                style={[
                  styles.sortText,
                  sortBy === option.id && styles.sortTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{searchQuery ? "🔍" : "📚"}</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? "Ничего не найдено" : "Словари отсутствуют"}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Попробуйте изменить критерии поиска"
                : "Скоро здесь появятся новые словари"}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearSearchButton}
              >
                <Text style={styles.clearSearchButtonText}>Очистить поиск</Text>
              </TouchableOpacity>
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
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    color: Colors.white,
    opacity: 0.8,
    marginBottom: Spacing.lg,
    fontSize: Typography.fontSize.sm,
  },
  searchContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  clearButtonText: {
    color: Colors.gray[500],
    fontSize: 18,
  },
  categoriesSection: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingVertical: Spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
    gap: Spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  resultsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  sortContainer: {
    gap: Spacing.xs,
  },
  sortChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  sortChipActive: {
    backgroundColor: Colors.primary + "20",
    borderColor: Colors.primary,
  },
  sortText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  sortTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  listContent: {
    padding: Spacing.lg,
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
  clearSearchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  clearSearchButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
