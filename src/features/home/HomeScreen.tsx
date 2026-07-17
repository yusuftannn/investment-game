import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { RootStackParamList } from '../../types';

const quickActions = [
  { label: 'Deposit', icon: 'add-circle-outline', accent: theme.colors.primary },
  { label: 'Trade', icon: 'swap-horizontal-outline', accent: '#60a5fa' },
  { label: 'Watchlist', icon: 'star-outline', accent: '#34d399' },
];

const watchlist = [
  { symbol: 'AAPL', name: 'Apple', price: '$193.40', change: '+2.8%', positive: true },
  { symbol: 'NVDA', name: 'NVIDIA', price: '$120.75', change: '+5.1%', positive: true },
  { symbol: 'TSLA', name: 'Tesla', price: '$247.10', change: '-1.3%', positive: false },
];

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleQuickAction = (label: string) => {
    switch (label) {
      case 'Deposit':
        navigation.navigate('Deposit');
        break;
      case 'Trade':
        navigation.navigate('Main');
        break;
      case 'Watchlist':
        navigation.navigate('Watchlist');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>Good morning</Text>
            <Text style={styles.title}>Yusuf, your portfolio is thriving.</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>Y</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Total balance</Text>
              <Text style={styles.balance}>$24,850.00</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>+12.4%</Text>
            </View>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>Available cash</Text>
              <Text style={styles.heroStatValue}>$8,420</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>Risk score</Text>
              <Text style={styles.heroStatValue}>Balanced</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </View>
        <View style={styles.actionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => handleQuickAction(action.label)}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.accent}20` }]}>
                <Ionicons name={action.icon as never} size={18} color={action.accent} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.sectionHeader} activeOpacity={0.8} onPress={() => navigation.navigate('Watchlist')}>
          <Text style={styles.sectionTitle}>Watchlist</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </TouchableOpacity>

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
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  eyebrow: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    marginTop: theme.spacing.xs,
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    maxWidth: 260,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.xs,
  },
  balance: {
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.text,
  },
  badge: {
    backgroundColor: `${theme.colors.primary}22`,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
  },
  badgeText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  heroStatBox: {
    flex: 1,
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  heroStatLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.xs,
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionLabel: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  listCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
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
