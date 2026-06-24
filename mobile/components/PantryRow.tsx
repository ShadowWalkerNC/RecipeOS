import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PantryItem } from '../lib/types';

interface Props {
  item: PantryItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, qty: number) => void;
}

export function PantryRow({ item, onDelete, onUpdate }: Props) {
  function confirmDelete() {
    Alert.alert('Remove item', `Remove "${item.displayName}" from pantry?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  }

  function nudge(delta: number) {
    onUpdate(item.id, Math.max(0, item.quantity + delta));
  }

  return (
    <View style={[styles.row, item.isLow && styles.rowLow]}>
      <View style={styles.left}>
        <Text style={styles.name}>{item.displayName}</Text>
        <Text style={styles.meta}>
          {item.quantity} {item.unit ?? ''}{item.isLow ? '  \u26A0 Low' : ''}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={() => nudge(-1)}>
          <Ionicons name="remove" size={16} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => nudge(1)}>
          <Ionicons name="add" size={16} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={confirmDelete}>
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#141414', borderRadius: 10,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#222',
  },
  rowLow: { borderColor: '#92400e', backgroundColor: '#1c1007' },
  left: { flex: 1 },
  name: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  meta: { color: '#888', fontSize: 12 },
  controls: { flexDirection: 'row', gap: 4 },
  btn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },
});
