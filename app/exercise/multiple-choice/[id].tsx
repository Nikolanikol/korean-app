import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useHaptics } from "@/hooks/useHaptics";
import { useSounds } from "@/hooks/useSounds";
import { useTTS } from "@/hooks/useTTS";
import { useProgressStore } from "@/store/progressStore";
import { useSettingsStore } from "@/store/settingsStore"; // ⬅️ ДОБАВИЛИ
import { useVocabularyStore } from "@/store/vocabularyStore";
import { MultipleChoiceQuestion } from "@/types/exercise";
import { commonStyles } from "@/utils/commonStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ⬅️ ДОБАВИЛИ
export default function MultipleChoiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { selectedVocabulary, fetchVocabularyById } = useVocabularyStore();
  const { getDueWords, getNewWords, updateWordProgress, recordActivity } =
    useProgressStore();
  const { playSuccess, playError, playLight } = useHaptics();
  const { speakKorean } = useTTS();
  const {
    playSuccess: playSoundSuccess,
    playComplete: playSoundComplete,
    playError: playSoundError,
  } = useSounds();
  const { settings } = useSettingsStore(); // ⬅️ ДОБАВИЛИ

  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadExercise();
    }
  }, [id]);

  const loadExercise = async () => {
    setIsLoading(true);
    await fetchVocabularyById(id!);

    // Подождем чтобы selectedVocabulary обновился
    setTimeout(() => {
      generateQuestions();
      setIsLoading(false);
    }, 100);
  };

  const generateQuestions = () => {
    if (!selectedVocabulary || !selectedVocabulary.words) return;

    const dueWords = getDueWords(id);
    const newWords = getNewWords(id!, selectedVocabulary.words, 5);

    const wordsToStudy = [
      ...dueWords.map((wp) =>
        selectedVocabulary.words.find((w) => w.id === wp.wordId)
      ),
      ...newWords,
    ]
      .filter(Boolean)
      .slice(0, settings.questionsPerRound); // ⬅️ ИСПОЛЬЗУЕМ НАСТРОЙКУ

    if (wordsToStudy.length === 0) {
      // Если нет слов на повторение, берем случайные
      const randomWords = selectedVocabulary.words
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.questionsPerRound);

      const generatedQuestions = randomWords.map((word) =>
        generateQuestion(word!, selectedVocabulary.words)
      );
      setQuestions(generatedQuestions);
      return;
    }

    const generatedQuestions = wordsToStudy.map((word) =>
      generateQuestion(word!, selectedVocabulary.words)
    );

    setQuestions(generatedQuestions);
  };

  const generateQuestion = (
    word: any,
    allWords: any[]
  ): MultipleChoiceQuestion => {
    const questionType =
      Math.random() > 0.5 ? "korean-to-russian" : "russian-to-korean";

    // Генерируем 3 неправильных варианта
    const wrongOptions = allWords
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) =>
        questionType === "korean-to-russian" ? w.translation : w.korean
      );

    const correctAnswer =
      questionType === "korean-to-russian" ? word.translation : word.korean;

    // Перемешиваем варианты
    const options = [correctAnswer, ...wrongOptions].sort(
      () => Math.random() - 0.5
    );

    return {
      word,
      correctAnswer,
      options,
      questionType,
    };
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === questions[currentIndex].correctAnswer;

    if (isCorrect) {
      // ✅ Вибрация и звук успеха
      playSuccess();
      playSoundSuccess();
      // 🔊 Произносим корейское слово
      speakKorean(questions[currentIndex].word.korean);

      setCorrectCount(correctCount + 1);
    } else {
      // ❌ Вибрация и звук ошибки
      playError();
      playSoundError();
      setIncorrectCount(incorrectCount + 1);
    }

    // Обновляем прогресс слова
    updateWordProgress(questions[currentIndex].word.id, id!, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      // 💫 Легкая вибрация при переходе
      playLight();
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Подсчитываем финальный результат
      const finalCorrect =
        correctCount +
        (selectedAnswer === questions[currentIndex].correctAnswer ? 1 : 0);
      const finalIncorrect =
        incorrectCount +
        (selectedAnswer !== questions[currentIndex].correctAnswer ? 1 : 0);

      // Проверяем: есть ли ошибки?
      if (finalIncorrect === 0) {
        // 🎉 ИДЕАЛЬНО! Все правильно!
        playSuccess(); // Вибрация
        playSoundComplete(); // FLAWLESS VICTORY! 🔥
      } else {
        // Есть ошибки - без звука успеха
        playLight(); // Просто легкая вибрация
      }

      // Завершаем упражнение
      recordActivity(questions.length, finalCorrect, questions.length);
      router.back();
    }
  };

  if (isLoading) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <Text style={styles.emptyText}>Нет слов для изучения</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statCorrect}>✓ {correctCount}</Text>
          <Text style={styles.statIncorrect}>✗ {incorrectCount}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>
            {currentQuestion.questionType === "korean-to-russian"
              ? "Что означает это слово?"
              : "Как будет по-корейски?"}
          </Text>
          <Text style={styles.questionText}>
            {currentQuestion.questionType === "korean-to-russian"
              ? currentQuestion.word.korean
              : currentQuestion.word.translation}
          </Text>
          {currentQuestion.questionType === "korean-to-russian" &&
            currentQuestion.word.romanization && (
              <Text style={styles.romanization}>
                {currentQuestion.word.romanization}
              </Text>
            )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;

            let optionStyle = styles.option;
            if (showResult && isSelected && isCorrect) {
              optionStyle = styles.optionCorrect;
            } else if (showResult && isSelected && !isCorrect) {
              optionStyle = styles.optionIncorrect;
            } else if (showResult && isCorrect) {
              optionStyle = styles.optionCorrect;
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleAnswer(option)}
                disabled={showResult}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionNumber}>
                    <Text style={styles.optionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                  {showResult && isCorrect && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <Text style={styles.crossmark}>✗</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Button */}
        {showResult && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < questions.length - 1 ? "Дальше →" : "Завершить"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs, // ⬅️ Очень маленький отступ
    paddingBottom: Spacing.sm, // ⬅️ Уменьшили
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  closeButton: {
    fontSize: 24,
    color: Colors.text.secondary,
    width: 40,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
  stats: {
    flexDirection: "row",
    gap: Spacing.sm,
    width: 80,
    justifyContent: "flex-end",
  },
  statCorrect: {
    fontSize: Typography.fontSize.sm,
    color: Colors.green[600],
    fontWeight: Typography.fontWeight.semibold,
  },
  statIncorrect: {
    fontSize: Typography.fontSize.sm,
    color: Colors.red[600],
    fontWeight: Typography.fontWeight.semibold,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md, // ⬅️ ДОБАВИЛИ
    paddingBottom: Spacing.xxxl,
  },
  questionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl, // ⬅️ Увеличили (было xl)
    marginBottom: Spacing.lg, // ⬅️ Уменьшили (было xl)
    borderWidth: 1,
    borderColor: Colors.gray[200],
    minHeight: 180,
  },
  questionLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  questionText: {
    fontSize: Typography.fontSize["3xl"], // ⬅️ Увеличили (было 2xl)
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  romanization: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  optionsContainer: {
    gap: Spacing.sm, // ⬅️ Уменьшили (было md)
  },
  option: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.gray[300],
  },
  optionCorrect: {
    backgroundColor: Colors.green[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderColor: Colors.green[500],
    borderWidth: 2,
  },
  optionIncorrect: {
    backgroundColor: Colors.red[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderColor: Colors.red[500],
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[200],
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  optionNumberText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
  },
  checkmark: {
    fontSize: 24,
    color: Colors.green[600],
  },
  crossmark: {
    fontSize: 24,
    color: Colors.red[600],
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    textAlign: "center",
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.md,
  },
  backButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
  },
});
