import { Colors } from "@/constants";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.gray[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Словари",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📚</Text>,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Библиотека",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🌐</Text>,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: "Изучение",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🎯</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
