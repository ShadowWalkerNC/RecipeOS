import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const PLACEHOLDER_PREP = [
  { id: '1', task: 'Butcher 20 chicken thighs — trim, brine 4h', station: 'Butchery', done: false },
  { id: '2', task: 'Reduce 2L veal stock to demi-glace', station: 'Sauce', done: false },
  { id: '3', task: 'Scale brioche dough x3 — proof 1h', station: 'Pastry', done: true },
  { id: '4', task: 'Brunoise 5kg mirepoix', station: 'Veg Prep', done: false },
  { id: '5', task: 'Portion 4kg salmon — 180g each', station: 'Fish', done: false },
];

export default function PrepScreen() {
  const [tasks, setTasks] = useState(PLACEHOLDER_PREP);
  const toggle = (id: string) => setTasks((t) => t.map((task) => task.id === id ? { ...task, done: !task.done } : task));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 4 }}>Prep List</Text>
        <Text style={{ color: '#888888', fontSize: 13, marginBottom: 16 }}>
          {tasks.filter((t) => t.done).length}/{tasks.length} complete
        </Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggle(item.id)}
              style={{
                backgroundColor: item.done ? '#0d1f0d' : '#111111',
                borderRadius: 12, padding: 14, marginBottom: 8,
                flexDirection: 'row', alignItems: 'center', gap: 12,
                borderLeftWidth: 3, borderLeftColor: item.done ? '#16a34a' : '#333333',
              }}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 11, borderWidth: 2,
                borderColor: item.done ? '#16a34a' : '#555555',
                backgroundColor: item.done ? '#16a34a' : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {item.done && <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: item.done ? '#555555' : '#ffffff', fontSize: 14, textDecorationLine: item.done ? 'line-through' : 'none' }}>
                  {item.task}
                </Text>
                <Text style={{ color: '#444444', fontSize: 11, marginTop: 3 }}>{item.station}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
