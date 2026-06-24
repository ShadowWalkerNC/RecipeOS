import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { Recipe } from '../lib/types';

interface Props { recipe: Recipe; }

export function RecipeCard({ recipe }: Props) {
  const router = useRouter();
  const icon = recipe.category?.icon ?? '\uD83C\uDF7D\uFE0F';
  const diffColor = { Beginner: '#16a34a', Intermediate: '#d97706', Advanced: '#dc2626' }[recipe.difficulty ?? 'Beginner'] ?? '#888';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.75}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{recipe.name}</Text>
        <Text style={styles.meta}>
          {recipe.category?.name ?? 'Uncategorised'}
          {recipe.base_servings ? `  ·  ${recipe.base_servings} servings` : ''}
        </Text>
      </View>
      {recipe.difficulty && (
        <View style={[styles.badge, { borderColor: diffColor }]}>
          <Text style={[styles.badgeText, { color: diffColor }]}>{recipe.difficulty}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#141414', borderRadius: 12,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#222',
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#1e1e1e',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  icon: { fontSize: 22 },
  info: { flex: 1 },
  name: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  meta: { color: '#888', fontSize: 12 },
  badge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '600' },
});
