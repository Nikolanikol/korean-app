import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Улучшенная навигация с учетом платформо-специфичных особенностей:
 *
 * iOS:
 * - Использует SF Symbols стиль
 * - Tab bar с большими иконками
 * - Safe area insets
 * - Тонкий border сверху
 *
 * Android:
 * - Material Design 3 стиль
 * - Elevation для тени
 * - Меньшие иконки
 * - Более компактный layout
 */
export default function TabsLayout() {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  const insets = useSafeAreaInsets();
  console.log("tabbar insets bottom", insets.bottom);
  // Динамические размеры
  const tabBarHeight = isIOS ? 85 : 65;
  const iconSize = isIOS ? 28 : 24;
  const paddingBottom = isIOS ? 25 : 8;
  const paddingTop = isIOS ? 8 : 6;

  // ВРЕМЕННО - для отладки
  console.log("📱 Системная панель:", {
    bottom: insets.bottom,
    hasNavBar: insets.bottom > 0 ? "ДА ✅" : "НЕТ (жесты) ❌",
  });
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isIOS ? Colors.gray[400] : Colors.gray[500],

        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.gray[200],

          // Адаптивная высота в зависимости от системной панели
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          // Визуальное разделение Tab Bar от системной области
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,

          // iOS стили
          ...(isIOS && {
            borderTopWidth: 0.5,
            borderTopColor: Colors.gray[200],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          }),

          // Android стили (Material Design)
          ...(isAndroid && {
            borderTopWidth: 0,
            elevation: 8,
            // Material Design использует более выраженную тень
          }),
        },

        tabBarLabelStyle: {
          fontSize: isIOS ? 11 : 12,
          fontWeight: isIOS ? "600" : "500",
          marginTop: isIOS ? 4 : 2,
        },

        tabBarIconStyle: {
          marginTop: isIOS ? 4 : 0,
        },

        // Анимации для Android
        ...(isAndroid && {
          tabBarHideOnKeyboard: true, // Скрывать при клавиатуре
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Словари",
          tabBarIcon: ({ color, focused, size }) => {
            // Разные иконки для платформ
            let iconName: keyof typeof Ionicons.glyphMap;

            if (isIOS) {
              iconName = focused ? "book" : "book-outline";
            } else {
              iconName = focused ? "library" : "library-outline";
            }

            return <Ionicons name={iconName} size={iconSize} color={color} />;
          },
          // Android может показывать badge
          tabBarBadge: undefined, // Можно добавить счетчик
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Библиотека",
          tabBarIcon: ({ color, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (isIOS) {
              iconName = focused ? "globe" : "globe-outline";
            } else {
              iconName = focused ? "earth" : "earth-outline";
            }

            return <Ionicons name={iconName} size={iconSize} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="study"
        options={{
          title: "Изучение",
          tabBarIcon: ({ color, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (isIOS) {
              iconName = focused ? "flame" : "flame-outline";
            } else {
              // Android использует более знакомую иконку школы
              iconName = focused ? "school" : "school-outline";
            }

            return <Ionicons name={iconName} size={iconSize} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (isIOS) {
              // iOS использует круглую иконку профиля
              iconName = focused ? "person-circle" : "person-circle-outline";
            } else {
              // Android использует простую иконку человека
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={iconSize} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
