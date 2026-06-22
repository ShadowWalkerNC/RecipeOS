import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { scaleIngredients } from '../../lib/ratio-engine';

export default function ScaleScreen() {
  const [baseServings, setBaseServings] = useState('4');
  const [targetServings, setTargetServings] = useState('10');
  const [ingredients, setIngredients] = useState([
    { name: 'Flour', amount: '500', unit: 'g' },
    { name: 'Butter', amount: '250', unit: 'g' },
    { name: 'Eggs', amount: '3', unit: 'whole' },
    { name: 'Sugar', amount: '100', unit: 'g' },
  ]);

  const scaled = scaleIngredients(ingredients, Number(baseServings), Number(targetServings));
  const factor = Number(targetServings) / Number(baseServings);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 16 }}>Recipe Scaler</Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#888888', fontSize: 12, marginBottom: 4 }}>BASE SERVINGS</Text>
            <TextInput
              value={baseServings}
              onChangeText={setBaseServings}
              keyboardType="numeric"
              style={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: 10, padding: 12, fontSize: 18, textAlign: 'center' }}
            />
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

        <View style={{ backgroundColor: '#111111', borderRadius: 10, padding: 10, marginBottom: 16, alignItems: 'center' }}>
          <Text style={{ color: '#16a34a', fontSize: 13, fontWeight: '600' }}>Scale Factor: {isNaN(factor) ? '—' : factor.toFixed(2)}x</Text>
        </View>

        {scaled.map((ing, i) => (
          <View key={i} style={{ backgroundColor: '#111111', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#cccccc', fontSize: 15 }}>{ing.name}</Text>
            <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{ing.scaledAmount} {ing.unit}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
