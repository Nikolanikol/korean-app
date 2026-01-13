import { useVocabularyStore } from "@/store/vocabularyStore";
import { Stack } from "expo-router";
import { useEffect } from "react";
// УДАЛИ: import '../global.css';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { fetchVocabularies } = useVocabularyStore();

  useEffect(() => {
    fetchVocabularies();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="vocabulary/[id]" />
        <Stack.Screen name="study/flashcards/[id]" />
      </Stack>
    </SafeAreaProvider>
  );
}
