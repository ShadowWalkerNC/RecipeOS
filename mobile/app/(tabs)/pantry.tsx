import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PLACEHOLDER_PANTRY = [
  { id: '1', name: 'All-Purpose Flour', qty: 12.5, unit: 'kg', status: 'ok' },
  { id: '2', name: 'Unsalted Butter', qty: 1.2, unit: 'kg', status: 'low' },
  { id: '3', name: 'Whole Eggs', qty: 24, unit: 'each', status: 'ok' },
  { id: '4', name: 'Kosher Salt', qty: 0.3, unit: 'kg', status: 'low' },
  { id: '5', name: 'Heavy Cream', qty: 4, unit: 'L', status: 'ok' },
];

export default function PantryScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 16 }}>Pantry</Text>
        <FlatList
          data={PLACEHOLDER_PANTRY}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: '#111111', borderRadius: 12, padding: 14, marginBottom: 8,
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              borderLeftWidth: 3, borderLeftColor: item.status === 'low' ? '#ef4444' : '#16a34a',
            }}>
              <Text style={{ color: '#ffffff', fontSize: 15 }}>{item.name}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{item.qty} {item.unit}</Text>
                {item.status === 'low' && <Text style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>LOW STOCK</Text>}
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
