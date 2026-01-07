import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { commonStyles } from "@/utils/commonStyles";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { vocabularies } = useVocabularyStore();

  if (!user) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <Text style={styles.emptyText}>Вы не авторизованы</Text>
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

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statValue}>{user.streakDays}</Text>
            <Text style={styles.statLabel}>Дней подряд 🔥</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSecondary]}>
            <Text style={styles.statValue}>{user.totalWordsLearned}</Text>
            <Text style={styles.statLabel}>Слов изучено</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={styles.statValue}>{vocabularies.length}</Text>
            <Text style={styles.statLabel}>Словарей</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={styles.statValue}>{totalWords}</Text>
            <Text style={styles.statLabel}>Всего слов</Text>
          </View>
        </View>
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

        <TouchableOpacity style={styles.menuItem}>
          <View>
            <Text style={styles.menuItemTitle}>Язык интерфейса</Text>
            <Text style={styles.menuItemSubtitle}>Русский</Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View>
            <Text style={styles.menuItemTitle}>Изучаемый язык</Text>
            <Text style={styles.menuItemSubtitle}>Корейский</Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View>
            <Text style={styles.menuItemTitle}>Ежедневная цель</Text>
            <Text style={styles.menuItemSubtitle}>20 новых слов в день</Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Поделиться приложением</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Оценить приложение</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>
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
});
