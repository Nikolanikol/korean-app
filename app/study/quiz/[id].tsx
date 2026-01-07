// app/study/quiz/[id].tsx
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl">📝 Квиз</Text>
      <Text className="text-gray-500 mt-2">Vocabulary ID: {id}</Text>
      <Text className="text-gray-400 mt-4">Coming soon...</Text>
    </View>
  );
}
