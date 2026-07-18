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
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundGlowSecondary} />

      <View style={styles.card}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandIcon}>📈</Text>
          </View>
          <Text style={styles.brandText}>Investment Game</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{helperText}</Text>

        {message ? <Text style={styles.success}>{message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>✉</Text>
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            placeholderTextColor={theme.colors.mutedText}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor={theme.colors.mutedText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCorrect={false}
          />
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{title}</Text>
          )}
        </Pressable>

        <Text style={styles.divider}>veya</Text>

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
  backgroundGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.colors.primary,
    opacity: 0.18,
  },
  backgroundGlowSecondary: {
    position: 'absolute',
    bottom: -50,
    left: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#2563eb',
    opacity: 0.16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: '#243449',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${theme.colors.primary}22`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  brandIcon: {
    fontSize: 20,
  },
  brandText: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.body,
    color: theme.colors.mutedText,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    backgroundColor: '#0f1b2c',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
  divider: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
  },
  toggle: {
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  toggleText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body,
    fontWeight: '600',
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
