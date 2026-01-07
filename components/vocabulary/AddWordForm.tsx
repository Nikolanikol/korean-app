import { PartOfSpeech } from "@/types/vocabulary";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

interface AddWordFormProps {
  vocabularyId: string;
  onAdd: (word: {
    korean: string;
    translation: string;
    romanization?: string;
    partOfSpeech?: PartOfSpeech;
    exampleSentence?: string;
    exampleTranslation?: string;
    tags: string[];
  }) => void;
  onCancel: () => void;
}

export function AddWordForm({
  vocabularyId,
  onAdd,
  onCancel,
}: AddWordFormProps) {
  const [korean, setKorean] = useState("");
  const [translation, setTranslation] = useState("");
  const [romanization, setRomanization] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>("noun");
  const [exampleSentence, setExampleSentence] = useState("");
  const [exampleTranslation, setExampleTranslation] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!korean.trim() || !translation.trim()) {
      Alert.alert("Ошибка", "Корейское слово и перевод обязательны");
      return;
    }

    onAdd({
      korean: korean.trim(),
      translation: translation.trim(),
      romanization: romanization.trim() || undefined,
      partOfSpeech,
      exampleSentence: exampleSentence.trim() || undefined,
      exampleTranslation: exampleTranslation.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

    // Очистить форму
    setKorean("");
    setTranslation("");
    setRomanization("");
    setExampleSentence("");
    setExampleTranslation("");
    setTags("");
  };

  return (
    <View className="bg-card rounded-2xl p-6 mx-4 shadow-lg">
      <Text className="text-xl font-bold text-gray-900 mb-4">
        Добавить слово
      </Text>

      {/* Корейское слово */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">
          Корейское слово *
        </Text>
        <TextInput
          value={korean}
          onChangeText={setKorean}
          placeholder="안녕하세요"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Перевод */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Перевод *</Text>
        <TextInput
          value={translation}
          onChangeText={setTranslation}
          placeholder="Здравствуйте"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Романизация */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Романизация</Text>
        <TextInput
          value={romanization}
          onChangeText={setRomanization}
          placeholder="annyeonghaseyo"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Часть речи */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Часть речи</Text>
        <View className="flex-row flex-wrap gap-2">
          {(["noun", "verb", "adjective", "particle"] as PartOfSpeech[]).map(
            (pos) => (
              <TouchableOpacity
                key={pos}
                onPress={() => setPartOfSpeech(pos)}
                className={`px-4 py-2 rounded-lg border-2 ${
                  partOfSpeech === pos
                    ? "bg-primary border-primary"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    partOfSpeech === pos ? "text-white" : "text-gray-700"
                  }`}
                >
                  {pos === "noun"
                    ? "Сущ."
                    : pos === "verb"
                    ? "Глагол"
                    : pos === "adjective"
                    ? "Прил."
                    : "Частица"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* Пример */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">
          Пример предложения
        </Text>
        <TextInput
          value={exampleSentence}
          onChangeText={setExampleSentence}
          placeholder="안녕하세요, 만나서 반갑습니다"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base mb-2"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          value={exampleTranslation}
          onChangeText={setExampleTranslation}
          placeholder="Здравствуйте, приятно познакомиться"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
          placeholderTextColor="#9CA3AF"
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
          placeholder="greeting, formal"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Кнопки */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 py-3 rounded-lg bg-gray-100"
        >
          <Text className="text-gray-700 text-center font-semibold">
            Отмена
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          className="flex-1 py-3 rounded-lg bg-secondary"
        >
          <Text className="text-white text-center font-semibold">Добавить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
