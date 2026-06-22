import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useRecipe } from '../../lib/queries';
import { scaleIngredients } from '../../lib/ratio-engine';
import { ScreenShell } from '../../components/ScreenShell';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: recipe, isLoading, error, refetch } = useRecipe(id);
  const [targetServings, setScaleTo] = useState<number | null>(null);

  return (
    <ScreenShell isLoading={isLoading} error={error} onRetry={refetch}>
      {recipe && (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Header */}
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
              <Text style={{ color: '#16a34a', fontSize: 14 }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '700', marginBottom: 4 }}>{recipe.name}</Text>
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
              {recipe.category?.name && <Text style={{ color: '#888888', fontSize: 13 }}>{recipe.category.name}</Text>}
              {recipe.yield_amount && <Text style={{ color: '#888888', fontSize: 13 }}>Yield: {recipe.yield_amount} {recipe.yield_unit}</Text>}
              {recipe.difficulty && <Text style={{ color: '#888888', fontSize: 13 }}>{recipe.difficulty}</Text>}
            </View>
            {recipe.description && (
              <Text style={{ color: '#aaaaaa', fontSize: 14, marginBottom: 20, lineHeight: 20 }}>{recipe.description}</Text>
            )}

            {/* Quick Scale */}
            <View style={{ backgroundColor: '#111111', borderRadius: 12, padding: 14, marginBottom: 24 }}>
              <Text style={{ color: '#888888', fontSize: 12, fontWeight: '600', marginBottom: 10 }}>QUICK SCALE</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[2, 4, 8, 12, 20, 50].map((n) => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setScaleTo(targetServings === n ? null : n)}
                    style={{
                      backgroundColor: targetServings === n ? '#16a34a' : '#1a1a1a',
                      borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10,
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600' }}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {targetServings && (
                <Text style={{ color: '#16a34a', fontSize: 12, marginTop: 8 }}>
                  Scale factor: {(targetServings / recipe.base_servings).toFixed(2)}x (base: {recipe.base_servings})
                </Text>
              )}
            </View>

            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ color: '#16a34a', fontSize: 16, fontWeight: '700', marginBottom: 10 }}>Ingredients</Text>
                {(() => {
                  const rawIngredients = recipe.ingredients!.map((i) => ({
                    name: i.name_override ?? i.ingredient?.name ?? 'Unknown',
                    amount: i.amount.toString(),
                    unit: i.unit,
                  }));
                  const scaled = targetServings
                    ? scaleIngredients(rawIngredients, recipe.base_servings, targetServings)
                    : rawIngredients.map((i) => ({ ...i, scaledAmount: i.amount }));
                  return scaled.map((ing, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' }}>
                      <Text style={{ color: '#cccccc', fontSize: 14, flex: 1 }}>
                        {ing.name}
                        {recipe.ingredients![idx].preparation
                          ? <Text style={{ color: '#555555' }}> — {recipe.ingredients![idx].preparation}</Text>
                          : null}
                      </Text>
                      <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600', marginLeft: 12 }}>
                        {'scaledAmount' in ing ? ing.scaledAmount : ing.amount} {ing.unit}
                      </Text>
                    </View>
                  ));
                })()}
              </View>
            )}

            {/* Method */}
            {recipe.steps && recipe.steps.length > 0 && (
              <View>
                <Text style={{ color: '#16a34a', fontSize: 16, fontWeight: '700', marginBottom: 10 }}>Method</Text>
                {recipe.steps.map((step) => (
                  <View key={step.id} style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                        <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>{step.step_number}</Text>
                      </View>
                      <Text style={{ color: '#cccccc', fontSize: 14, flex: 1, lineHeight: 21 }}>{step.instruction}</Text>
                    </View>
                    {step.tip && (
                      <View style={{ backgroundColor: '#1a2000', borderRadius: 8, padding: 10, marginTop: 8, marginLeft: 34 }}>
                        <Text style={{ color: '#a3e635', fontSize: 12 }}>💡 {step.tip}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {recipe.notes && (
              <View style={{ backgroundColor: '#111111', borderRadius: 12, padding: 14, marginTop: 16 }}>
                <Text style={{ color: '#888888', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>NOTES</Text>
                <Text style={{ color: '#aaaaaa', fontSize: 14, lineHeight: 20 }}>{recipe.notes}</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      )}
    </ScreenShell>
  );
}
