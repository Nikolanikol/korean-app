import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { commonStyles } from "@/utils/commonStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FlashcardsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { selectedVocabulary, fetchVocabularyById } = useVocabularyStore();

  useEffect(() => {
    if (id) {
      fetchVocabularyById(id);
    }
  }, [id]);

  const vocabulary = selectedVocabulary;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knowCount, setKnowCount] = useState(0);
  const [studyingCount, setStudyingCount] = useState(0);

  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleKnow = () => {
    setKnowCount(knowCount + 1);
    nextCard();
  };

  const handleStudying = () => {
    setStudyingCount(studyingCount + 1);
    nextCard();
  };

  const nextCard = () => {
    if (!vocabulary?.words) return;

    if (currentIndex < vocabulary.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    } else {
      // Завершено
      router.back();
    }
  };

  if (!vocabulary || !vocabulary.words.length) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <Text style={styles.errorText}>Словарь не найден</Text>
      </View>
    );
  }

  const currentWord = vocabulary.words[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.words.length) * 100;

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={commonStyles.rowBetween}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.closeButton}>✕ Закрыть</Text>
          </TouchableOpacity>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {vocabulary.words.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCardGreen}>
          <Text style={styles.statValue}>{knowCount}</Text>
          <Text style={styles.statLabel}>Знаю</Text>
        </View>
        <View style={styles.statCardYellow}>
          <Text style={styles.statValue}>{studyingCount}</Text>
          <Text style={styles.statLabel}>Учу</Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={flipCard}
          activeOpacity={0.9}
          style={styles.cardTouchable}
        >
          {/* Front Side */}
          <Animated.View
            style={[
              styles.cardFront,
              frontAnimatedStyle,
              { backfaceVisibility: "hidden" },
            ]}
          >
            <Text style={styles.cardLabel}>Корейский</Text>
            <Text style={styles.cardKorean}>{currentWord.korean}</Text>
            {currentWord.romanization && (
              <Text style={styles.cardRomanization}>
                {currentWord.romanization}
              </Text>
            )}
            <Text style={styles.cardHint}>Нажмите для перевода</Text>
          </Animated.View>

          {/* Back Side */}
          <Animated.View
            style={[
              styles.cardBack,
              backAnimatedStyle,
              { backfaceVisibility: "hidden" },
            ]}
          >
            <Text style={styles.cardLabelWhite}>Перевод</Text>
            <Text style={styles.cardTranslation}>
              {currentWord.translation}
            </Text>
            {currentWord.exampleSentence && (
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleSentence}>
                  {currentWord.exampleSentence}
                </Text>
                {currentWord.exampleTranslation && (
                  <Text style={styles.exampleTranslation}>
                    {currentWord.exampleTranslation}
                  </Text>
                )}
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      {isFlipped && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleStudying}
            style={styles.studyingButton}
          >
            <Text style={styles.actionButtonText}>😐 Учу</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleKnow} style={styles.knowButton}>
            <Text style={styles.actionButtonText}>✅ Знаю</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
  },
  progressText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.base,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.white + "33",
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    marginTop: Spacing.lg,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  statCardGreen: {
    flex: 1,
    backgroundColor: Colors.green[50],
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.green[200],
  },
  statCardYellow: {
    flex: 1,
    backgroundColor: Colors.yellow[50],
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.yellow[100],
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  cardTouchable: {
    width: "100%",
  },
  cardFront: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.xxxl,
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardBack: {
    position: "absolute",
    width: "100%",
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.xxxl,
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLabel: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.lg,
  },
  cardLabelWhite: {
    color: Colors.white,
    opacity: 0.8,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.lg,
  },
  cardKorean: {
    fontSize: Typography.fontSize["4xl"],
    fontWeight: Typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: Spacing.lg,
    color: Colors.text.primary,
  },
  cardRomanization: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.lg,
    textAlign: "center",
  },
  cardHint: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xxxl,
  },
  cardTranslation: {
    color: Colors.white,
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  exampleContainer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.white + "33",
  },
  exampleSentence: {
    color: Colors.white,
    opacity: 0.9,
    textAlign: "center",
    marginBottom: Spacing.sm,
    fontSize: Typography.fontSize.sm,
  },
  exampleTranslation: {
    color: Colors.white,
    opacity: 0.7,
    textAlign: "center",
    fontSize: Typography.fontSize.sm,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  studyingButton: {
    flex: 1,
    backgroundColor: Colors.yellow[500],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  knowButton: {
    flex: 1,
    backgroundColor: Colors.green[500],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  actionButtonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  errorText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
  },
});
