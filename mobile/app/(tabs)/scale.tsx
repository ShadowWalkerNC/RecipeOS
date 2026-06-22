import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRecipes } from '../../lib/queries';
import { scaleIngredients } from '../../lib/ratio-engine';
import { ScreenShell } from '../../components/ScreenShell';
import type { Recipe } from '../../lib/types';

export default function ScaleScreen() {
  const [targetServings, setTargetServings] = useState('10');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');

  const { data: recipes = [], isLoading } = useRecipes(recipeSearch || undefined);

  const base = selectedRecipe?.base_servings ?? 1;
  const target = parseInt(targetServings, 10);
  const factor = isNaN(target) || target <= 0 ? null : target / base;

  const scaledIngredients = selectedRecipe?.ingredients
    ? scaleIngredients(
        selectedRecipe.ingredients.map((i) => ({
          name: i.name_override ?? i.ingredient?.name ?? 'Unknown',
          amount: i.amount.toString(),
          unit: i.unit,
        })),
        base,
        isNaN(target) ? base : target
      )
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 16 }}>Recipe Scaler</Text>

        {/* Recipe Picker */}
        <TouchableOpacity
          onPress={() => setPickerOpen(true)}
          style={{ backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14, marginBottom: 16 }}
        >
          <Text style={{ color: selectedRecipe ? '#ffffff' : '#555555', fontSize: 15 }}>
            {selectedRecipe ? selectedRecipe.name : 'Select a recipe...'}
          </Text>
        </TouchableOpacity>

        {/* Servings Input */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#888888', fontSize: 12, marginBottom: 4 }}>BASE SERVINGS</Text>
            <View style={{ backgroundColor: '#1a1a1a', borderRadius: 10, padding: 12, alignItems: 'center' }}>
              <Text style={{ color: '#888888', fontSize: 18 }}>{base}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#888888', fontSize: 12, marginBottom: 4 }}>TARGET SERVINGS</Text>
            <TextInput
              value={targetServings}
              onChangeText={setTargetServings}
              keyboardType="numeric"
              style={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: 10, padding: 12, fontSize: 18, textAlign: 'center' }}
            />
          </View>
        </View>

        {factor !== null && (
          <View style={{ backgroundColor: '#111111', borderRadius: 10, padding: 10, marginBottom: 16, alignItems: 'center' }}>
            <Text style={{ color: '#16a34a', fontSize: 13, fontWeight: '600' }}>Scale Factor: {factor.toFixed(2)}x</Text>
          </View>
        )}

        {/* Scaled Ingredients */}
        {scaledIngredients.length > 0 ? (
          scaledIngredients.map((ing, i) => (
            <View key={i} style={{ backgroundColor: '#111111', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#cccccc', fontSize: 15 }}>{ing.name}</Text>
              <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{ing.scaledAmount} {ing.unit}</Text>
            </View>
          ))
        ) : (
          !selectedRecipe && (
            <Text style={{ color: '#444444', textAlign: 'center', marginTop: 40, fontSize: 14 }}>Select a recipe to start scaling</Text>
          )
        )}
      </ScrollView>

      {/* Recipe Picker Modal */}
      <Modal visible={pickerOpen} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: '#0a0a0a', padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700' }}>Select Recipe</Text>
            <TouchableOpacity onPress={() => setPickerOpen(false)}>
              <Text style={{ color: '#16a34a', fontSize: 15 }}>Done</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={recipeSearch}
            onChangeText={setRecipeSearch}
            placeholder="Search..."
            placeholderTextColor="#555"
            style={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 15 }}
          />
          {isLoading ? (
            <Text style={{ color: '#555', textAlign: 'center', marginTop: 40 }}>Loading...</Text>
          ) : (
            <FlatList
              data={recipes}
              keyExtractor={(r) => r.id}
              renderItem={({ item }: { item: Recipe }) => (
                <TouchableOpacity
                  onPress={() => { setSelectedRecipe(item); setPickerOpen(false); }}
                  style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' }}
                >
                  <Text style={{ color: '#ffffff', fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ color: '#555', fontSize: 12, marginTop: 2 }}>Base: {item.base_servings} servings</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
