import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePrepTasks, useTogglePrepTask } from '../../lib/queries';
import { ScreenShell } from '../../components/ScreenShell';
import type { PrepTask } from '../../lib/types';

export default function PrepScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const { data: tasks = [], isLoading, error, refetch } = usePrepTasks(today);
  const { mutate: toggle } = useTogglePrepTask();

  const done = tasks.filter((t) => t.is_done).length;
  const progress = tasks.length > 0 ? done / tasks.length : 0;

  return (
    <ScreenShell isLoading={isLoading} error={error} onRetry={refetch}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        <View style={{ padding: 16, flex: 1 }}>
          <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 4 }}>Prep List</Text>
          <Text style={{ color: '#888888', fontSize: 13, marginBottom: 12 }}>{today} — {done}/{tasks.length} complete</Text>

          {/* Progress bar */}
          <View style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 2, marginBottom: 16 }}>
            <View style={{ height: 4, width: `${Math.round(progress * 100)}%`, backgroundColor: '#16a34a', borderRadius: 2 }} />
          </View>

          {tasks.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ color: '#555555', fontSize: 15 }}>No prep tasks for today.</Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item: PrepTask) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: { item: PrepTask }) => (
                <TouchableOpacity
                  onPress={() => toggle({ id: item.id, is_done: !item.is_done })}
                  style={{
                    backgroundColor: item.is_done ? '#0d1f0d' : '#111111',
                    borderRadius: 12, padding: 14, marginBottom: 8,
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    borderLeftWidth: 3, borderLeftColor: item.is_done ? '#16a34a' : '#333333',
                  }}
                >
                  <View style={{
                    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
                    borderColor: item.is_done ? '#16a34a' : '#555555',
                    backgroundColor: item.is_done ? '#16a34a' : 'transparent',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.is_done && <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: item.is_done ? '#555555' : '#ffffff', fontSize: 14, textDecorationLine: item.is_done ? 'line-through' : 'none' }}>
                      {item.task}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 4, gap: 10 }}>
                      {item.station && <Text style={{ color: '#444444', fontSize: 11 }}>{item.station}</Text>}
                      {item.estimated_minutes && <Text style={{ color: '#444444', fontSize: 11 }}>{item.estimated_minutes}m</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </ScreenShell>
  );
}
