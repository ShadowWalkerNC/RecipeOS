import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  async function handleCapture() {
    if (!cameraRef.current || scanning) return;
    setScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ocr-recipe`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: photo.base64 }),
        }
      );
      if (!res.ok) throw new Error(`OCR failed: ${res.status}`);
      const recipe = await res.json();
      const { data, error } = await supabase
        .from('recipes')
        .insert({ ...recipe, user_id: session?.user.id, is_public: false })
        .select()
        .single();
      if (error) throw error;
      setCameraOpen(false);
      router.push(`/recipe/${data.id}`);
    } catch (err: any) {
      Alert.alert('Scan failed', err.message ?? 'Something went wrong. Try again.');
    } finally {
      setScanning(false);
    }
  }

  if (!permission) return <View style={styles.safe} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={64} color="#333" />
          <Text style={styles.permTitle}>Camera access needed</Text>
          <Text style={styles.permBody}>RecipeOS needs camera access to scan and import recipes.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (cameraOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
          <SafeAreaView style={styles.cameraUI}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCameraOpen(false)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.shutterRow}>
              <TouchableOpacity style={[styles.shutterBtn, scanning && styles.shutterBtnDisabled]} onPress={handleCapture} disabled={scanning}>
                {scanning ? <ActivityIndicator color="#fff" /> : <Ionicons name="camera" size={32} color="#fff" />}
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Point at a printed or handwritten recipe</Text>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={64} color="#333" />
        <Text style={styles.permTitle}>Scan a Recipe</Text>
        <Text style={styles.permBody}>Point your camera at a handwritten or printed recipe to import it automatically into your vault.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setCameraOpen(true)}>
          <Text style={styles.primaryBtnText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  permTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 20, marginBottom: 8, textAlign: 'center' },
  permBody: { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 32 },
  primaryBtn: { backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cameraUI: { flex: 1, justifyContent: 'space-between' },
  closeBtn: { alignSelf: 'flex-end', margin: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 6 },
  shutterRow: { alignItems: 'center', marginBottom: 32 },
  shutterBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  shutterBtnDisabled: { backgroundColor: '#333' },
  hint: { textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16, paddingHorizontal: 24 },
});
