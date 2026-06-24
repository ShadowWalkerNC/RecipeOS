import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

type Mode = 'magic' | 'password';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleMagicLink() {
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
    }
  }

  async function handlePassword() {
    if (!email.trim() || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) Alert.alert('Sign in failed', error.message);
    // Auth guard in _layout.tsx handles redirect on success
  }

  async function handleSignUp() {
    if (!email.trim() || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign up failed', error.message);
    } else {
      Alert.alert('Check your email', 'We sent a confirmation link to ' + email.trim());
    }
  }

  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Ionicons name="mail-outline" size={64} color="#16a34a" />
          <Text style={styles.sentTitle}>Check your inbox</Text>
          <Text style={styles.sentBody}>
            We sent a magic link to{' '}
            <Text style={{ color: '#fff' }}>{email.trim()}</Text>.
            {`\n`}Tap the link to sign in.
          </Text>
          <TouchableOpacity onPress={() => setSent(false)} style={{ marginTop: 24 }}>
            <Text style={{ color: '#888', fontSize: 14 }}>Use a different email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo / wordmark */}
          <View style={styles.logoRow}>
            <Text style={styles.logo}>\uD83C\uDF7D\uFE0F</Text>
            <Text style={styles.wordmark}>RecipeOS</Text>
          </View>
          <Text style={styles.tagline}>Your personal recipe vault.</Text>

          {/* Mode toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'magic' && styles.toggleBtnActive]}
              onPress={() => setMode('magic')}
            >
              <Text style={[styles.toggleText, mode === 'magic' && styles.toggleTextActive]}>Magic Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'password' && styles.toggleBtnActive]}
              onPress={() => setMode('password')}
            >
              <Text style={[styles.toggleText, mode === 'password' && styles.toggleTextActive]}>Password</Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          {/* Password (password mode only) */}
          {mode === 'password' && (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#555"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          )}

          {/* Primary CTA */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={mode === 'magic' ? handleMagicLink : handlePassword}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryBtnText}>
                  {mode === 'magic' ? 'Send Magic Link' : 'Sign In'}
                </Text>
            }
          </TouchableOpacity>

          {/* Sign up link (password mode) */}
          {mode === 'password' && (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.secondaryBtnText}>Create account</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.legal}>
            By continuing you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logo: { fontSize: 36, marginRight: 10 },
  wordmark: { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: '#666', fontSize: 15, marginBottom: 40 },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#16a34a' },
  toggleText: { color: '#666', fontSize: 14, fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  input: {
    backgroundColor: '#141414',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  primaryBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnDisabled: { backgroundColor: '#1a3a1a' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryBtnText: { color: '#aaa', fontSize: 15, fontWeight: '600' },
  sentTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 20, marginBottom: 12 },
  sentBody: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  legal: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 28, lineHeight: 16 },
});
