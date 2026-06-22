import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useRecipes } from '../../lib/queries';
import { ScreenShell } from '../../components/ScreenShell';
import type { Recipe } from '../../lib/types';

export default function RecipesScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { data: recipes = [], isLoading, error, refetch } = useRecipes(search || undefined);

  return (
    <ScreenShell isLoading={isLoading} error={error} onRetry={refetch}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        <View style={{ padding: 16, flex: 1 }}>
          <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Recipe Vault</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search recipes..."
            placeholderTextColor="#555555"
            style={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 15 }}
          />
          {recipes.length === 0 && !isLoading ? (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ color: '#555555', fontSize: 15 }}>No recipes found.</Text>
              <TouchableOpacity
                onPress={() => router.push('/recipe/new')}
                style={{ marginTop: 16, backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 }}
              >
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>Add Your First Recipe</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={recipes}
              keyExtractor={(item: Recipe) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: { item: Recipe }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/recipe/${item.id}`)}
                  style={{ backgroundColor: '#111111', borderRadius: 12, padding: 16, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#16a34a' }}
                >
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 6, gap: 12, flexWrap: 'wrap' }}>
                    {item.category?.name && <Text style={{ color: '#888888', fontSize: 12 }}>{item.category.name}</Text>}
                    {item.yield_amount && <Text style={{ color: '#888888', fontSize: 12 }}>Yield: {item.yield_amount} {item.yield_unit}</Text>}
                    {item.difficulty && <Text style={{ color: '#888888', fontSize: 12 }}>{item.difficulty}</Text>}
                  </View>
                  {item.tags.length > 0 && (
                    <View style={{ flexDirection: 'row', marginTop: 6, gap: 6 }}>
                      {item.tags.slice(0, 3).map((tag) => (
                        <View key={tag} style={{ backgroundColor: '#1a2e1a', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                          <Text style={{ color: '#16a34a', fontSize: 11 }}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </ScreenShell>
  );
}
