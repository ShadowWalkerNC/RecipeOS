import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#111111', borderTopColor: '#222222' },
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#666666',
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#ffffff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Recipes', tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="scale"
        options={{ title: 'Scale', tabBarIcon: ({ color }) => <Ionicons name="resize-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="pantry"
        options={{ title: 'Pantry', tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="prep"
        options={{ title: 'Prep List', tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="scan"
        options={{ title: 'Scan', tabBarIcon: ({ color }) => <Ionicons name="camera-outline" size={22} color={color} /> }}
      />
    </Tabs>
  );
}
