import { View, Text, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { usePantry, useUpdatePantry } from '../../lib/queries';
import { ScreenShell } from '../../components/ScreenShell';
import type { PantryItem } from '../../lib/types';

export default function PantryScreen() {
  const [lowOnly, setLowOnly] = useState(false);
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [editQty, setEditQty] = useState('');

  const { data: items = [], isLoading, error, refetch } = usePantry(lowOnly);
  const { mutate: updateQty, isPending } = useUpdatePantry();

  const lowCount = items.filter((i) => i.isLow).length;

  function submitEdit() {
    if (!editItem) return;
    const qty = parseFloat(editQty);
    if (!isNaN(qty)) updateQty({ id: editItem.id, quantity: qty }, { onSuccess: () => setEditItem(null) });
  }

  return (
    <ScreenShell isLoading={isLoading} error={error} onRetry={refetch}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        <View style={{ padding: 16, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View>
              <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>Pantry</Text>
              {lowCount > 0 && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 2 }}>{lowCount} item{lowCount > 1 ? 's' : ''} low</Text>}
            </View>
            <TouchableOpacity
              onPress={() => setLowOnly(!lowOnly)}
              style={{ backgroundColor: lowOnly ? '#ef4444' : '#1a1a1a', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 }}
            >
              <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600' }}>{lowOnly ? 'LOW STOCK' : 'All Items'}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item: PantryItem) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: { item: PantryItem }) => (
              <TouchableOpacity
                onPress={() => { setEditItem(item); setEditQty(item.quantity.toString()); }}
                style={{
                  backgroundColor: '#111111', borderRadius: 12, padding: 14, marginBottom: 8,
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  borderLeftWidth: 3, borderLeftColor: item.isLow ? '#ef4444' : '#16a34a',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#ffffff', fontSize: 15 }}>{item.displayName}</Text>
                  {item.location && <Text style={{ color: '#444444', fontSize: 11, marginTop: 2 }}>{item.location}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{item.quantity} {item.unit}</Text>
                  {item.isLow && <Text style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>LOW STOCK</Text>}
                  {item.reorder_at && !item.isLow && (
                    <Text style={{ color: '#444444', fontSize: 11, marginTop: 2 }}>Reorder at {item.reorder_at}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Edit Qty Modal */}
        <Modal visible={!!editItem} animationType="slide" presentationStyle="formSheet" transparent>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <View style={{ backgroundColor: '#111111', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 4 }}>{editItem?.displayName}</Text>
              <Text style={{ color: '#888888', fontSize: 13, marginBottom: 16 }}>Current: {editItem?.quantity} {editItem?.unit}</Text>
              <TextInput
                value={editQty}
                onChangeText={setEditQty}
                keyboardType="numeric"
                placeholder="New quantity"
                placeholderTextColor="#555"
                style={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: 10, padding: 14, fontSize: 18, marginBottom: 12 }}
                autoFocus
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setEditItem(null)}
                  style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14, alignItems: 'center' }}
                >
                  <Text style={{ color: '#888888', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={submitEdit}
                  disabled={isPending}
                  style={{ flex: 2, backgroundColor: '#16a34a', borderRadius: 10, padding: 14, alignItems: 'center' }}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '700' }}>{isPending ? 'Saving...' : 'Update Stock'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenShell>
  );
}
