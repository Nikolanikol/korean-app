import { useVocabularyStore } from "@/store/vocabularyStore";
import { Stack } from "expo-router";
import { useEffect } from "react";
// УДАЛИ: import '../global.css';

export default function RootLayout() {
  const { fetchVocabularies } = useVocabularyStore();

  useEffect(() => {
    fetchVocabularies();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="vocabulary/[id]" />
      <Stack.Screen name="vocabulary/create" />
      <Stack.Screen name="study/flashcards/[id]" />
      <Stack.Screen name="exercise/multiple-choice/[id]" />
    </Stack>
  );
}
