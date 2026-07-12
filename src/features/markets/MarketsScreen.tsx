import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

export function MarketsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Markets</Text>
      <Text style={styles.subtitle}>Markets feature placeholder</Text>
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
  title: {
    fontSize: theme.typography.title,
    fontWeight: '600',
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.body,
    color: theme.colors.mutedText,
  },
});
