import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Ionicons name="camera-outline" size={64} color="#333333" />
        <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '700', marginTop: 20, marginBottom: 8 }}>Scan a Recipe</Text>
        <Text style={{ color: '#888888', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          Point your camera at a handwritten or printed recipe to import it automatically into your vault.
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 }}
        >
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
