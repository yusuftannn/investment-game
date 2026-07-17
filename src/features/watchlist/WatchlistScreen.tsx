import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { RootStackParamList } from '../../types';

type WatchlistScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const watchlist = [
  { symbol: 'AAPL', name: 'Apple', price: '$193.40', change: '+2.8%', positive: true },
  { symbol: 'NVDA', name: 'NVIDIA', price: '$120.75', change: '+5.1%', positive: true },
  { symbol: 'TSLA', name: 'Tesla', price: '$247.10', change: '-1.3%', positive: false },
  { symbol: 'MSFT', name: 'Microsoft', price: '$334.20', change: '+1.5%', positive: true },
  { symbol: 'AMZN', name: 'Amazon', price: '$135.60', change: '+0.9%', positive: true },
];

export function WatchlistScreen() {
  const navigation = useNavigation<WatchlistScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.eyebrow}>Watchlist</Text>
          <Text style={styles.title}>Your favorite assets</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listCard}>
          {watchlist.map((asset) => (
            <View key={asset.symbol} style={styles.assetRow}>
              <View style={styles.assetInfo}>
                <View style={styles.assetIcon}>
                  <Text style={styles.assetIconText}>{asset.symbol[0]}</Text>
                </View>
                <View>
                  <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                  <Text style={styles.assetName}>{asset.name}</Text>
                </View>
              </View>

              <View style={styles.assetOutcome}>
                <Text style={styles.assetPrice}>{asset.price}</Text>
                <Text style={[styles.assetChange, asset.positive ? styles.positive : styles.negative]}>
                  {asset.change}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
  },
  headerTextWrap: {
    flex: 1,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    marginTop: theme.spacing.xs,
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  listCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  assetIconText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  assetSymbol: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  assetName: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
  },
  assetOutcome: {
    alignItems: 'flex-end',
  },
  assetPrice: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  assetChange: {
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  positive: {
    color: theme.colors.success,
  },
  negative: {
    color: theme.colors.danger,
  },
});
