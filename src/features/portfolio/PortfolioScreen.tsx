import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { portfolioService } from '../../services/portfolio';
import { formatCurrency } from '../../utils/formatters';
import { theme } from '../../theme';
import { PortfolioPosition } from '../../types';

type PortfolioSummary = {
  totalBalance: number;
  availableCash: number;
  dailyChange: number;
  returnPercent: number;
};

export function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPortfolio = async () => {
      const summary = await portfolioService.getPortfolio();
      const data = await portfolioService.getPositions();

      if (!isMounted) {
        return;
      }

      setPortfolio(summary);
      setPositions(data);
      setIsLoading(false);
    };

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || !portfolio) {
    return (
      <ScreenContainer style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>Portfolio</Text>
            <Text style={styles.title}>Your holdings at a glance</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>Live balance</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total balance</Text>
          <Text style={styles.summaryValue}>{formatCurrency(portfolio.totalBalance)}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Available cash</Text>
              <Text style={styles.summaryItemValue}>{formatCurrency(portfolio.availableCash)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Today</Text>
              <Text style={[styles.summaryItemValue, styles.highlight]}>
                {portfolio.dailyChange >= 0 ? '+' : '-'}{formatCurrency(Math.abs(portfolio.dailyChange))} ({portfolio.returnPercent.toFixed(1)}%)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Positions</Text>
          <Text style={styles.sectionHint}>{positions.length} assets</Text>
        </View>

        <View style={styles.positionList}>
          {positions.map((position) => (
            <View key={position.symbol} style={styles.positionRow}>
              <View style={styles.positionInfo}>
                <View style={styles.positionAvatar}>
                  <Text style={styles.positionAvatarText}>{position.symbol[0]}</Text>
                </View>
                <View>
                  <Text style={styles.positionSymbol}>{position.symbol}</Text>
                  <Text style={styles.positionName}>{position.name}</Text>
                </View>
              </View>
              <View style={styles.positionStats}>
                <Text style={styles.positionValue}>{formatCurrency(position.marketValue)}</Text>
                <Text style={[styles.positionChange, position.changePercent >= 0 ? styles.positive : styles.negative]}>
                  {position.changePercent >= 0 ? '+' : ''}{position.changePercent.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
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
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    maxWidth: 260,
  },
  badgePill: {
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xl,
  },
  badgeText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.xs,
  },
  summaryItemValue: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  highlight: {
    color: theme.colors.success,
  },
  sectionHeader: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionHint: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
  },
  positionList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  positionAvatarText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
  positionSymbol: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
  positionName: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs / 2,
  },
  positionStats: {
    alignItems: 'flex-end',
  },
  positionValue: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  positionChange: {
    fontSize: theme.typography.caption,
    fontWeight: '700',
    marginTop: theme.spacing.xs / 2,
  },
  positive: {
    color: theme.colors.success,
  },
  negative: {
    color: theme.colors.danger,
  },
});
