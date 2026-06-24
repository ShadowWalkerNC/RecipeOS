import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PrepTask } from '../lib/types';

interface Props {
  task: PrepTask;
  onToggle: (id: string, is_done: boolean) => void;
}

export function PrepTaskRow({ task, onToggle }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onToggle(task.id, !task.is_done)} activeOpacity={0.7}>
      <View style={[styles.check, task.is_done && styles.checkDone]}>
        {task.is_done && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      <View style={styles.info}>
        <Text style={[styles.task, task.is_done && styles.taskDone]} numberOfLines={2}>
          {task.task}
        </Text>
        <View style={styles.meta}>
          {task.station && (
            <View style={styles.stationBadge}>
              <Text style={styles.stationText}>{task.station}</Text>
            </View>
          )}
          {task.estimated_minutes && (
            <Text style={styles.time}>{task.estimated_minutes}m</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e1e1e', gap: 12 },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#444', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkDone: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  info: { flex: 1 },
  task: { color: '#e5e5e5', fontSize: 14, lineHeight: 20 },
  taskDone: { color: '#555', textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  stationBadge: { backgroundColor: '#1e2a1e', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  stationText: { color: '#4ade80', fontSize: 11, fontWeight: '600' },
  time: { color: '#666', fontSize: 11 },
});
