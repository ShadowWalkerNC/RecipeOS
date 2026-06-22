import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function ScreenShell({ isLoading, error, onRetry, children }: Props) {
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ color: '#ef4444', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
          {error.message ?? 'Something went wrong'}
        </Text>
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            style={{ backgroundColor: '#1a1a1a', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 }}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return <>{children}</>;
}
