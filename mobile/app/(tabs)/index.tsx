import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const PLACEHOLDER_RECIPES = [
  { id: '1', name: 'Buttermilk Fried Chicken', category: 'Protein', yield: '4 portions', difficulty: 'Intermediate' },
  { id: '2', name: 'Classic Beurre Blanc', category: 'Sauce', yield: '500ml', difficulty: 'Advanced' },
  { id: '3', name: 'Brioche Dough', category: 'Bread', yield: '2 loaves', difficulty: 'Intermediate' },
];

export default function RecipesScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const filtered = PLACEHOLDER_RECIPES.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Recipe Vault</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search recipes..."
          placeholderTextColor="#555555"
          style={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 15 }}
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/recipe/${item.id}`)}
              style={{ backgroundColor: '#111111', borderRadius: 12, padding: 16, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#16a34a' }}
            >
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
              <View style={{ flexDirection: 'row', marginTop: 6, gap: 12 }}>
                <Text style={{ color: '#888888', fontSize: 12 }}>{item.category}</Text>
                <Text style={{ color: '#888888', fontSize: 12 }}>Yield: {item.yield}</Text>
                <Text style={{ color: '#888888', fontSize: 12 }}>{item.difficulty}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
