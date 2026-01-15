import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { mockVocabularies } from "@/mocks/vocabularies.mock";
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
  useWindowDimensions,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

// Компонент "Мои словари"
function MyVocabulariesTab() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { vocabularies, isLoading, fetchVocabularies } = useVocabularyStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Загружаем только если список пуст
    if (vocabularies.length === 0) {
      fetchVocabularies();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVocabularies();
    setRefreshing(false);
  };

  return (
    <View style={commonStyles.container}>
      {/* Create Button */}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/vocabulary/create")}
        >
          <Text style={styles.createButtonText}>+ Создать словарь</Text>
        </TouchableOpacity>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={[commonStyles.centered, styles.emptyContainer]}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyText}>
              {isLoading ? "Загрузка..." : "У вас пока нет словарей"}
            </Text>
            <Text style={styles.emptyHint}>
              Создайте свой первый словарь или добавьте из библиотеки
            </Text>
          </View>
        }
      />
    </View>
  );
}

// Компонент "Библиотека"
function LibraryTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { user } = useAuthStore(); // ⬅️ ДОБАВЛЯЕМ

  // Используем моковые публичные словари (от ДРУГИХ пользователей)
  const publicVocabularies = mockVocabularies.filter(
    (v) => v.isPublic && v.userId !== (user?.id || "user-google-1") // ⬅️ ОБНОВЛЯЕМ
  );

  const filteredVocabularies = publicVocabularies.filter((vocab) => {
    const matchesSearch = vocab.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || vocab.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={commonStyles.container}>
      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerEmoji}>🌐</Text>
        <Text style={styles.infoBannerText}>
          Публичные словари от сообщества
        </Text>
      </View>

      {/* Vocabularies List */}
      <FlatList
        data={filteredVocabularies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VocabularyCard
            vocabulary={item}
            onPress={() => router.push(`/vocabulary/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={[commonStyles.centered, styles.emptyContainer]}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Словари не найдены</Text>
          </View>
        }
      />
    </View>
  );
}

// Главный компонент с TabView
export default function VocabulariesScreen() {
  const layout = useWindowDimensions();
  const { user } = useAuthStore();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "my", title: "Мои" },
    { key: "library", title: "Библиотека" },
  ]);

  const renderScene = SceneMap({
    my: MyVocabulariesTab,
    library: LibraryTab,
  });

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Словари</Text>
        {user && (
          <Text style={styles.headerSubtitle}>
            {user.totalWordsLearned} слов изучено
          </Text>
        )}
      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            activeColor={Colors.primary}
            inactiveColor={Colors.text.secondary}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingTop: 48,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  headerTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  tabBar: {
    backgroundColor: Colors.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  tabIndicator: {
    backgroundColor: Colors.primary,
    height: 3,
  },
  tabLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: "none",
  },
  createButtonContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
  },
  createButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  infoBanner: {
    backgroundColor: Colors.blue[50],
    padding: Spacing.md,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  infoBannerEmoji: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.blue[700],
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  emptyContainer: {
    paddingTop: Spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  emptyHint: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: "center",
  },
});
