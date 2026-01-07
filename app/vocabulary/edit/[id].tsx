import { useVocabularyStore } from "@/store/vocabularyStore";
import { DifficultyLevel } from "@/types/vocabulary";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditVocabularyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { vocabularies, updateVocabulary, isLoading } = useVocabularyStore();

  const vocabulary = vocabularies.find((v) => v.id === id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (vocabulary) {
      setTitle(vocabulary.title);
      setDescription(vocabulary.description || "");
      setCategory(vocabulary.category || "");
      setDifficulty(vocabulary.difficultyLevel || "beginner");
      setIsPublic(vocabulary.isPublic);
      setTags(vocabulary.tags.join(", "));
    }
  }, [vocabulary]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Название обязательно");
      return;
    }

    try {
      await updateVocabulary(id!, {
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        difficultyLevel: difficulty,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isPublic,
      });

      Alert.alert("Успех", "Изменения сохранены!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить изменения");
    }
  };

  if (!vocabulary) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">Словарь не найден</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary pt-12 pb-6 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white mb-3">← Отмена</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">
          Редактировать словарь
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Название */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Название *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
          />
        </View>

        {/* Описание */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Описание</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            textAlignVertical="top"
          />
        </View>

        {/* Уровень */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">
            Уровень сложности
          </Text>
          <View className="flex-row gap-2">
            {(
              ["beginner", "intermediate", "advanced"] as DifficultyLevel[]
            ).map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setDifficulty(level)}
                className={`flex-1 py-3 rounded-lg border-2 ${
                  difficulty === level
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    difficulty === level ? "text-white" : "text-gray-700"
                  }`}
                >
                  {level === "beginner"
                    ? "Начальный"
                    : level === "intermediate"
                    ? "Средний"
                    : "Продвинутый"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Категория */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Категория</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
          />
        </View>

        {/* Теги */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">
            Теги (через запятую)
          </Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
          />
        </View>

        {/* Публичный */}
        <TouchableOpacity
          onPress={() => setIsPublic(!isPublic)}
          className="flex-row items-center mb-8 bg-white p-4 rounded-lg border border-gray-300"
        >
          <View
            className={`w-12 h-7 rounded-full mr-3 ${
              isPublic ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <View
              className={`w-5 h-5 bg-white rounded-full mt-1 ${
                isPublic ? "ml-6" : "ml-1"
              }`}
            />
          </View>
          <Text className="text-gray-900 font-semibold">Публичный словарь</Text>
        </TouchableOpacity>

        {/* Кнопки */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          className={`py-4 rounded-xl mb-3 ${
            isLoading ? "bg-gray-400" : "bg-secondary"
          }`}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
