import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
import { mockVocabularies } from "@/mocks/vocabularies.mock";
import { Vocabulary } from "@/types/vocabulary";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);

  const categories = [
    "Все",
    "Фразы",
    "Еда",
    "Экзамен",
    "Грамматика",
    "Путешествия",
  ];

  useEffect(() => {
    // Фильтруем только публичные словари
    let filtered = mockVocabularies.filter((v) => v.isPublic);

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "Все") {
      filtered = filtered.filter(
        (v) => v.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setVocabularies(filtered);
  }, [searchQuery, selectedCategory]);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary pt-12 pb-6 px-4">
        <Text className="text-white text-2xl font-bold mb-4">
          Библиотека словарей
        </Text>

        {/* Search */}
        <View className="bg-white rounded-lg px-4 py-2 flex-row items-center">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Поиск словарей..."
            className="flex-1 text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-14 bg-white border-b border-gray-200"
        contentContainerStyle={{ padding: 16, gap: 8 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat === "Все" ? null : cat)}
            className={`px-4 py-2 rounded-full ${
              (cat === "Все" && !selectedCategory) || selectedCategory === cat
                ? "bg-primary"
                : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-semibold ${
                (cat === "Все" && !selectedCategory) || selectedCategory === cat
                  ? "text-white"
                  : "text-gray-700"
              }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <Text className="text-gray-600">
          Найдено словарей: {vocabularies.length}
        </Text>
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
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 text-lg text-center">
              {searchQuery ? "Ничего не найдено" : "Словари отсутствуют"}
            </Text>
            <Text className="text-gray-400 mt-2 text-center">
              Попробуйте изменить критерии поиска
            </Text>
          </View>
        }
      />
    </View>
  );
}
