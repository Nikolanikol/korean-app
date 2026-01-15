import { DailyGoalModal } from "@/components/modals/DailyGoalModal";
import { GoogleAccountPicker } from "@/components/modals/GoogleAccountPicker";
import { LanguageModal } from "@/components/modals/LanguageModal";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { googleAccountToUser } from "@/mocks/auth.mock";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { commonStyles } from "@/utils/commonStyles";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function ProfileScreen() {
  const { user, logout, loginWithUser } = useAuthStore();
  const { vocabularies } = useVocabularyStore();
  const { totalWordsLearned, currentStreak, longestStreak } =
    useProgressStore();
  const { settings } = useSettingsStore();
  // Состояния для модалок
  const [showDailyGoalModal, setShowDailyGoalModal] = useState(false);
  const [showInterfaceLanguageModal, setShowInterfaceLanguageModal] =
    useState(false);
  const [showLearningLanguageModal, setShowLearningLanguageModal] =
    useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  // Функция поделиться
  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Привет! Я изучаю корейский язык с помощью этого приложения. Попробуй и ты! 🇰🇷",
        // url: 'https://apps.apple.com/app/...' // когда будет в Store
      });
    } catch (error) {
      console.error("Ошибка при попытке поделиться:", error);
    }
  };

  // Функция оценить приложение
  const handleRate = () => {
    Alert.alert(
      "Оцените приложение",
      "Спасибо за поддержку! Это поможет нам стать лучше.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Оценить",
          onPress: () => {
            // В будущем здесь будет ссылка на App Store / Play Store
            // const storeUrl = Platform.select({
            //   ios: 'itms-apps://apps.apple.com/app/...',
            //   android: 'market://details?id=...',
            // });
            // Linking.openURL(storeUrl);
            Alert.alert("Спасибо!", "Скоро приложение появится в Store 🎉");
          },
        },
      ]
    );
  };
  // Функция авторизации через Google
  const handleGoogleLogin = (account: any) => {
    const newUser = googleAccountToUser(account);
    loginWithUser(newUser);
    setShowGooglePicker(false);
  };
  // Если не авторизован - показываем экран входа
  if (!user) {
    return (
      <View style={commonStyles.container}>
        <View style={styles.loginContainer}>
          <View style={styles.loginHeader}>
            <Text style={styles.loginEmoji}>🇰🇷</Text>
            <Text style={styles.loginTitle}>Korean Learning App</Text>
            <Text style={styles.loginSubtitle}>
              Войдите, чтобы синхронизировать прогресс между устройствами
            </Text>
          </View>

          <View style={styles.loginFeatures}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>☁️</Text>
              <Text style={styles.featureText}>Облачное хранение</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>Статистика прогресса</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={styles.featureText}>Достижения</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => setShowGooglePicker(true)}
          >
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Войти через Google</Text>
          </TouchableOpacity>

          <Text style={styles.skipText}>
            Можете продолжить без входа, но прогресс не сохранится
          </Text>
        </View>

        <GoogleAccountPicker
          visible={showGooglePicker}
          onClose={() => setShowGooglePicker(false)}
          onSelectAccount={handleGoogleLogin}
        />
      </View>
    );
  }

  const totalWords = vocabularies.reduce((sum, v) => sum + v.wordCount, 0);

  return (
    <ScrollView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>

        <Text style={styles.username}>{user.username || "Пользователь"}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Subscription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Подписка</Text>
        <View style={styles.card}>
          <View style={commonStyles.rowBetween}>
            <View>
              <Text style={styles.subscriptionTitle}>
                {user.subscriptionTier === "free"
                  ? "Бесплатный"
                  : user.subscriptionTier === "pro"
                  ? "Pro"
                  : "Unlimited"}
              </Text>
              <Text style={styles.subscriptionSubtitle}>
                {user.subscriptionTier === "free"
                  ? "Ограниченный доступ"
                  : "Полный доступ ко всем функциям"}
              </Text>
            </View>
            {user.subscriptionTier === "free" && (
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Learning Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки обучения</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowInterfaceLanguageModal(true)}
        >
          <View>
            <Text style={styles.menuItemTitle}>Язык интерфейса</Text>
            <Text style={styles.menuItemSubtitle}>
              {settings.interfaceLanguage === "ru"
                ? "Русский"
                : settings.interfaceLanguage === "en"
                ? "English"
                : "한국어"}
            </Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowLearningLanguageModal(true)}
        >
          <View>
            <Text style={styles.menuItemTitle}>Изучаемый язык</Text>
            <Text style={styles.menuItemSubtitle}>
              {settings.learningLanguage === "ru"
                ? "Русский"
                : settings.learningLanguage === "en"
                ? "English"
                : "Корейский"}
            </Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowDailyGoalModal(true)}
          style={styles.menuItem}
        >
          <View>
            <Text style={styles.menuItemTitle}>Ежедневная цель</Text>
            <Text style={styles.menuItemSubtitle}>
              {settings.dailyGoal} новых слов в день
            </Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionButtonText}>Поделиться приложением</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleRate}>
          <Text style={styles.actionButtonText}>Оценить приложение</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>
      {/* Модалки */}
      <DailyGoalModal
        visible={showDailyGoalModal}
        onClose={() => setShowDailyGoalModal(false)}
      />
      <LanguageModal
        visible={showInterfaceLanguageModal}
        onClose={() => setShowInterfaceLanguageModal(false)}
        type="interface"
      />

      <LanguageModal
        visible={showLearningLanguageModal}
        onClose={() => setShowLearningLanguageModal(false)}
        type="learning"
      />
      <GoogleAccountPicker
        visible={showGooglePicker}
        onClose={() => setShowGooglePicker(false)}
        onSelectAccount={handleGoogleLogin}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: Colors.white,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  username: {
    color: Colors.white,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
  },
  email: {
    color: Colors.white,
    opacity: 0.8,
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
  statsContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  statCardPrimary: {
    backgroundColor: Colors.card,
  },
  statCardSecondary: {
    backgroundColor: Colors.card,
  },
  statCardPurple: {
    backgroundColor: Colors.card,
  },
  statCardOrange: {
    backgroundColor: Colors.card,
  },
  statValue: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
    fontSize: Typography.fontSize.base,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  subscriptionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  subscriptionSubtitle: {
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
  upgradeButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  upgradeButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.sm,
  },
  menuItem: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemTitle: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.base,
  },
  menuItemSubtitle: {
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
  menuItemArrow: {
    color: Colors.gray[400],
    fontSize: Typography.fontSize.xl,
  },
  actionButton: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  actionButtonText: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: "center",
    fontSize: Typography.fontSize.base,
  },
  logoutButton: {
    backgroundColor: Colors.red[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.red[200],
    marginBottom: Spacing.xxxl,
  },
  logoutButtonText: {
    color: Colors.red[600],
    fontWeight: Typography.fontWeight.semibold,
    textAlign: "center",
    fontSize: Typography.fontSize.base,
  },
  emptyText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  loginHeader: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
  },
  loginEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  loginTitle: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  loginSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  loginFeatures: {
    marginBottom: Spacing.xxxl,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    marginBottom: Spacing.md,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  googleIconText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
  },
  googleButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  skipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: "center",
  },
});
