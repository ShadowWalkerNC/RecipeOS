import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase, authRedirectUri } from '../../lib/supabase';

type Mode = 'magic' | 'password';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  // Handle deep link: recipeos://auth/callback?code=xxx
  useEffect(() => {
    async function handleUrl(url: string) {
      const parsed = Linking.parse(url);
      const code = parsed.queryParams?.code as string | undefined;
      if (!code) return;

      setLoading(true);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      setLoading(false);

      if (error) {
        Alert.alert('Sign in failed', error.message);
      } else {
        router.replace('/(tabs)');
      }
    }

    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // Listen for deep links while app is open
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);

  async function handleMagicLink() {
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: authRedirectUri,
      },
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
    // _layout.tsx auth guard redirects on success
  }

  async function handleSignUp() {
    if (!email.trim() || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: authRedirectUri },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign up failed', error.message);
    } else {
      Alert.alert('Check your email', `We sent a confirmation link to ${email.trim()}`);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Signing you in…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.sentIcon}>\uD83D\uDCE7</Text>
          <Text style={styles.sentTitle}>Check your inbox</Text>
          <Text style={styles.sentBody}>
            Magic link sent to{' '}
            <Text style={{ color: '#fff' }}>{email.trim()}</Text>.{`\n`}
            Tap the link to sign in — it will open the app automatically.
          </Text>
          <TouchableOpacity onPress={() => setSent(false)} style={{ marginTop: 24 }}>
            <Text style={{ color: '#555', fontSize: 13 }}>Use a different email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
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

          <TouchableOpacity
            style={[styles.primaryBtn, (!email.trim() || (mode === 'password' && !password)) && styles.primaryBtnDisabled]}
            onPress={mode === 'magic' ? handleMagicLink : handlePassword}
            disabled={!email.trim() || (mode === 'password' && !password)}
          >
            <Text style={styles.primaryBtnText}>
              {mode === 'magic' ? 'Send Magic Link' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {mode === 'password' && (
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleSignUp}>
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
  loadingText: { color: '#888', marginTop: 16, fontSize: 14 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logo: { fontSize: 36, marginRight: 10 },
  wordmark: { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: '#666', fontSize: 15, marginBottom: 40 },
  toggle: { flexDirection: 'row', backgroundColor: '#141414', borderRadius: 10, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#222' },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#16a34a' },
  toggleText: { color: '#666', fontSize: 14, fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  input: { backgroundColor: '#141414', borderRadius: 12, color: '#fff', fontSize: 15, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  primaryBtn: { backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  primaryBtnDisabled: { backgroundColor: '#1a3a1a' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  secondaryBtnText: { color: '#aaa', fontSize: 15, fontWeight: '600' },
  sentIcon: { fontSize: 56, marginBottom: 16 },
  sentTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  sentBody: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  legal: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 28, lineHeight: 16 },
});
