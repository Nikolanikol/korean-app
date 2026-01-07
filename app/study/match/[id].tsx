// app/study/match/[id].tsx
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl">🎯 Matching</Text>
      <Text className="text-gray-500 mt-2">Vocabulary ID: {id}</Text>
      <Text className="text-gray-400 mt-4">Coming soon...</Text>
    </View>
  );
}
