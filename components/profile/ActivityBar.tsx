import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { useProgressStore } from "@/store/progressStore";
import { StyleSheet, Text, View } from "react-native";

export function ActivityBar() {
  const { getWeekActivity, currentStreak } = useProgressStore();
  const weekActivity = getWeekActivity();

  // Названия дней недели
  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Получаем день недели из даты (0 = воскресенье, 1 = понедельник, ...)
  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Переводим в 0 = понедельник
  };

  // Определяем цвет в зависимости от активности
  const getActivityColor = (wordsStudied: number) => {
    if (wordsStudied === 0) return Colors.gray[200];
    if (wordsStudied < 5) return Colors.green[200];
    if (wordsStudied < 10) return Colors.green[500];
    if (wordsStudied < 20) return Colors.green[600];
    return Colors.green[800];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Активность за неделю</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{currentStreak} дней</Text>
        </View>
      </View>

      <View style={styles.calendar}>
        {weekActivity.map((activity, index) => {
          const dayOfWeek = getDayOfWeek(activity.date);
          const color = getActivityColor(activity.wordsStudied);

          return (
            <View key={activity.date} style={styles.dayContainer}>
              <Text style={styles.dayName}>{dayNames[dayOfWeek]}</Text>
              <View style={[styles.activityBox, { backgroundColor: color }]}>
                {activity.wordsStudied > 0 && (
                  <Text style={styles.activityCount}>
                    {activity.wordsStudied}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendText}>Меньше</Text>
        <View style={styles.legendBoxes}>
          <View
            style={[styles.legendBox, { backgroundColor: Colors.gray[200] }]}
          />
          <View
            style={[styles.legendBox, { backgroundColor: Colors.green[200] }]}
          />
          <View
            style={[styles.legendBox, { backgroundColor: Colors.green[500] }]}
          />
          <View
            style={[styles.legendBox, { backgroundColor: Colors.green[600] }]}
          />
          <View
            style={[styles.legendBox, { backgroundColor: Colors.green[800] }]}
          />
        </View>
        <Text style={styles.legendText}>Больше</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.orange[50],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  streakText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.orange[600],
  },
  calendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  dayContainer: {
    alignItems: "center",
    flex: 1,
  },
  dayName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  activityBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  activityCount: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  legendText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  legendBoxes: {
    flexDirection: "row",
    marginHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
