

// ============================================
// utils/commonStyles.ts
// ============================================
import { StyleSheet } from 'react-native';
// ВАЖНО: Импортируй напрямую из файлов, а не через index!
import { BorderRadius } from '../constants/BorderRadius';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';

export const commonStyles = StyleSheet.create({
  // Контейнеры
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Карточки
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  
  cardShadow: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  
  // Текст
  textPrimary: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
  },
  
  textSecondary: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
  },
  
  textBold: {
    fontWeight: Typography.fontWeight.bold,
  },
  
  textSemibold: {
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Заголовки
  h1: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  
  h2: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  
  h3: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  
  // Кнопки
  button: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Инпуты
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  
  // Бейджи
  badge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  
  badgePrimary: {
    backgroundColor: Colors.primary + '20',
  },
  
  badgeSuccess: {
    backgroundColor: Colors.green[100],
  },
  
  badgeWarning: {
    backgroundColor: Colors.yellow[100],
  },
  
  // Отступы
  p0: { padding: 0 },
  p1: { padding: Spacing.xs },
  p2: { padding: Spacing.sm },
  p3: { padding: Spacing.md },
  p4: { padding: Spacing.lg },
  
  px4: { paddingHorizontal: Spacing.lg },
  py4: { paddingVertical: Spacing.lg },
  
  mt2: { marginTop: Spacing.sm },
  mt3: { marginTop: Spacing.md },
  mt4: { marginTop: Spacing.lg },
  
  mb2: { marginBottom: Spacing.sm },
  mb3: { marginBottom: Spacing.md },
  mb4: { marginBottom: Spacing.lg },
});