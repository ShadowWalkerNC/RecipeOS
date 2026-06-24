import { useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRecipes } from '../../lib/queries';
import { RecipeCard } from '../../components/RecipeCard';

export default function VaultScreen() {
  const [search, setSearch] = useState('');
  const { data: recipes, isLoading, error } = useRecipes(search || undefined);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Vault</Text>
      </View>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>
      {isLoading && <View style={styles.center}><ActivityIndicator color="#16a34a" /></View>}
      {error && <View style={styles.center}><Text style={styles.errorText}>Failed to load recipes.</Text></View>}
      {!isLoading && !error && recipes?.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>\uD83D\uDDC2\uFE0F</Text>
          <Text style={styles.emptyTitle}>No recipes yet</Text>
          <Text style={styles.emptyBody}>Tap the scan tab to import your first recipe.</Text>
        </View>
      )}
      <FlatList
        data={recipes ?? []}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141414', borderRadius: 10, marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: '#222' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { color: '#ef4444', textAlign: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyBody: { color: '#888', fontSize: 13, textAlign: 'center' },
});
