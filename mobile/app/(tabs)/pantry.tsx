import { useState } from 'react';
import { View, Text, TextInput, FlatList, Modal, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePantry, useAddPantryItem, useUpdatePantryItem, useDeletePantryItem } from '../../lib/queries';
import { PantryRow } from '../../components/PantryRow';

export default function PantryScreen() {
  const { data: items, isLoading, error } = usePantry();
  const addItem = useAddPantryItem();
  const updateItem = useUpdatePantryItem();
  const deleteItem = useDeletePantryItem();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('');
  const [reorderAt, setReorderAt] = useState('');

  async function handleAdd() {
    if (!name || !qty) return;
    await addItem.mutateAsync({ name_override: name, quantity: parseFloat(qty), unit: unit || undefined, reorder_at: reorderAt ? parseFloat(reorderAt) : undefined });
    setName(''); setQty(''); setUnit(''); setReorderAt('');
    setModalVisible(false);
  }

  const lowCount = items?.filter((i) => i.isLow).length ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pantry</Text>
          {lowCount > 0 && <Text style={styles.lowBanner}>\u26A0 {lowCount} item{lowCount !== 1 ? 's' : ''} low</Text>}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      {isLoading && <View style={styles.center}><ActivityIndicator color="#16a34a" /></View>}
      {error && <View style={styles.center}><Text style={styles.errorText}>Failed to load pantry.</Text></View>}
      <FlatList
        data={items ?? []}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PantryRow item={item} onDelete={(id) => deleteItem.mutate(id)} onUpdate={(id, qty) => updateItem.mutate({ id, quantity: qty })} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>\uD83E\uDD6B</Text>
            <Text style={styles.emptyTitle}>Pantry is empty</Text>
          </View>
        ) : null}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Add Pantry Item</Text>
            <TextInput style={styles.input} placeholder="Item name" placeholderTextColor="#555" value={name} onChangeText={setName} />
            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Quantity" placeholderTextColor="#555" keyboardType="numeric" value={qty} onChangeText={setQty} />
              <TextInput style={[styles.input, { width: 80, marginLeft: 8 }]} placeholder="Unit" placeholderTextColor="#555" value={unit} onChangeText={setUnit} />
            </View>
            <TextInput style={styles.input} placeholder="Reorder at (optional)" placeholderTextColor="#555" keyboardType="numeric" value={reorderAt} onChangeText={setReorderAt} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd} disabled={addItem.isPending}>
              <Text style={styles.saveBtnText}>{addItem.isPending ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: '#888', fontSize: 14 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  lowBanner: { color: '#f59e0b', fontSize: 12, marginTop: 2 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { color: '#ef4444' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#888', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { backgroundColor: '#141414', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#1e1e1e', borderRadius: 10, color: '#fff', fontSize: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a' },
  row: { flexDirection: 'row' },
  saveBtn: { backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
