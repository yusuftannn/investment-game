import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { marketDataService } from '../../services/market-data';
import { formatCurrency } from '../../utils/formatters';
import { theme } from '../../theme';
import { Market } from '../../types';
import { useNavigation } from '@react-navigation/native';

export function MarketsScreen() {
  const navigation = useNavigation<any>();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filtered, setFiltered] = useState<Market[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await marketDataService.getMarkets();
    setMarkets(data);
    setFiltered(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(markets);
      return;
    }
    setFiltered(
      markets.filter(
        (m) => m.symbol.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
      )
    );
  }, [query, markets]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <ScreenContainer style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={theme.colors.mutedText} />
            <TextInput
              placeholder="Search symbol or name"
              placeholderTextColor={theme.colors.mutedText}
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close" size={18} color={theme.colors.mutedText} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.listCard}>
          {filtered.map((m) => (
            <TouchableOpacity
              key={m.symbol}
              style={styles.row}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('MarketDetail', { symbol: m.symbol })}
            >
              <View style={styles.left}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{m.symbol[0]}</Text>
                </View>
                <View>
                  <Text style={styles.symbol}>{m.symbol}</Text>
                  <Text style={styles.name}>{m.name}</Text>
                </View>
              </View>

              <View style={styles.right}>
                <Text style={styles.price}>{formatCurrency(m.price)}</Text>
                <Text style={[styles.change, m.change >= 0 ? styles.positive : styles.negative]}>
                  {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: theme.spacing.xxl },
  searchRow: { marginBottom: theme.spacing.lg },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    marginLeft: theme.spacing.sm,
    flex: 1,
    color: theme.colors.text,
    height: 36,
  },
  listCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: { color: theme.colors.primary, fontWeight: '700' },
  symbol: { color: theme.colors.text, fontWeight: '700' },
  name: { color: theme.colors.mutedText, fontSize: theme.typography.caption },
  right: { alignItems: 'flex-end' },
  price: { color: theme.colors.text, fontWeight: '700' },
  change: { marginTop: theme.spacing.xs / 2, fontSize: theme.typography.caption, fontWeight: '700' },
  positive: { color: theme.colors.success },
  negative: { color: theme.colors.danger },
});
