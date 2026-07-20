import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Market, RootStackParamList } from '../../types';
import { marketDataService } from '../../services/market-data';
import { formatCurrency } from '../../utils/formatters';
import { getWatchlistSymbols, toggleWatchlistSymbol } from '../../utils/watchlistStorage';

type WatchlistScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function WatchlistScreen() {
  const navigation = useNavigation<WatchlistScreenNavigationProp>();
  const [watchlist, setWatchlist] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWatchlist = useCallback(async () => {
    setIsLoading(true);
    const symbols = await getWatchlistSymbols();
    const data = await marketDataService.getMarkets();
    const filtered = data.filter((item) => symbols.includes(item.symbol));
    setWatchlist(filtered);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const handleToggleWatchlist = async (symbol: string) => {
    await toggleWatchlistSymbol(symbol);
    await loadWatchlist();
  };

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
          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading watchlist...</Text>
            </View>
          ) : watchlist.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="star-outline" size={24} color={theme.colors.mutedText} />
              <Text style={styles.emptyText}>No favorites yet.</Text>
              <Text style={styles.emptySubtext}>Add assets from the markets screen.</Text>
            </View>
          ) : (
            watchlist.map((asset) => (
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
                  <Text style={styles.assetPrice}>{formatCurrency(asset.price)}</Text>
                  <Text style={[styles.assetChange, asset.change >= 0 ? styles.positive : styles.negative]}>
                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(1)}%
                  </Text>
                </View>

                <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleWatchlist(asset.symbol)}>
                  <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            ))
          )}
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
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.mutedText,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
    fontWeight: '700',
  },
  emptySubtext: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedText,
    textAlign: 'center',
  },
  assetPrice: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  assetChange: {
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  actionButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  positive: {
    color: theme.colors.success,
  },
  negative: {
    color: theme.colors.danger,
  },
});
