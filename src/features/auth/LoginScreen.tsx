import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { authService } from '../../services/auth';
import { useAppStore } from '../../store';
import { theme } from '../../theme';

export function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const setAuthStatus = useAppStore((state) => state.setAuthStatus);

  const title = mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol';
  const helperText = mode === 'login' ? 'Hesabına giriş yap' : 'Yeni bir hesap oluştur';

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('E-posta ve şifre girmeniz gerekiyor.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result =
        mode === 'login'
          ? await authService.signInWithEmail(email.trim(), password)
          : await authService.signUpWithEmail(email.trim(), password);

      if (result.error) {
        throw result.error;
      }

      if (mode === 'login') {
        setAuthenticated(true);
        setAuthStatus('authenticated');
        setMessage('Giriş başarılı.');
      } else {
        const session = (result.data as { session?: unknown } | null)?.session;
        if (session) {
          setAuthenticated(true);
          setAuthStatus('authenticated');
          setMessage('Kayıt başarılı. Hoş geldin!');
        } else {
          setMessage('Kayıt başarılı. Giriş yapmak için e-posta onayı gerekebilir.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{helperText}</Text>

        {message ? <Text style={styles.success}>{message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="E-posta"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} disabled={loading} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{title}</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.toggle}
          onPress={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
            setMessage(null);
          }}
        >
          <Text style={styles.toggleText}>
            {mode === 'login'
              ? 'Hesabın yok mu? Kayıt ol'
              : 'Zaten hesabın var mı? Giriş yap'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.body,
    color: theme.colors.mutedText,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: theme.typography.body,
  },
  toggle: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  toggleText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body,
  },
  success: {
    marginBottom: theme.spacing.md,
    color: theme.colors.success,
    fontSize: theme.typography.body,
  },
  error: {
    marginBottom: theme.spacing.md,
    color: theme.colors.danger,
    fontSize: theme.typography.body,
  },
});
