import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Svg, Polyline, Circle } from "react-native-svg";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { portfolioService } from "../../services/portfolio";
import { formatCurrency } from "../../utils/formatters";
import { theme } from "../../theme";
import { PortfolioPosition } from "../../types";

type PortfolioSummary = {
  totalBalance: number;
  availableCash: number;
  dailyChange: number;
  returnPercent: number;
};

const performanceTrend = [
  { label: "M", value: 23400 },
  { label: "T", value: 23850 },
  { label: "W", value: 24020 },
  { label: "T", value: 24780 },
  { label: "F", value: 24610 },
  { label: "S", value: 25140 },
  { label: "S", value: 24850 },
];

const allocationData = [
  { label: "Technology", value: 42, color: theme.colors.primary },
  { label: "Healthcare", value: 23, color: "#60a5fa" },
  { label: "Finance", value: 18, color: "#34d399" },
  { label: "Energy", value: 17, color: "#f97316" },
];

export function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPortfolio = useCallback(async () => {
    setIsLoading(true);

    const [summary, data] = await Promise.all([
      portfolioService.getPortfolio(),
      portfolioService.getPositions(),
    ]);

    setPortfolio(summary);
    setPositions(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPortfolio();
    setRefreshing(false);
  };

  const chartMin = Math.min(...performanceTrend.map((point) => point.value));
  const chartMax = Math.max(...performanceTrend.map((point) => point.value));

  const chartPoints = performanceTrend
    .map((point, index) => {
      const x = (index / (performanceTrend.length - 1)) * 300;
      const y =
        100 -
        ((point.value - chartMin) / (chartMax - chartMin || 1)) * 70;

      return `${x},${y}`;
    })
    .join(" ");

  if (isLoading || !portfolio) {
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          <Text style={styles.summaryValue}>
            {formatCurrency(portfolio.totalBalance)}
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Available cash</Text>
              <Text style={styles.summaryItemValue}>
                {formatCurrency(portfolio.availableCash)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Today</Text>
              <Text style={[styles.summaryItemValue, styles.highlight]}>
                {portfolio.dailyChange >= 0 ? "+" : "-"}
                {formatCurrency(Math.abs(portfolio.dailyChange))} (
                {portfolio.returnPercent.toFixed(1)}%)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance trend</Text>
            <Text style={styles.sectionHint}>7D</Text>
          </View>

          <Svg width="100%" height={130} viewBox="0 0 300 110">
            <Polyline
              points={chartPoints}
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {performanceTrend.map((point, index) => {
              const x = (index / (performanceTrend.length - 1)) * 300;
              const y =
                100 -
                ((point.value - chartMin) / (chartMax - chartMin || 1)) * 70;

              return (
                <Circle
                  key={`${point.label}-${index}`}
                  cx={x}
                  cy={y}
                  r={index === performanceTrend.length - 1 ? 4 : 2.5}
                  fill={
                    index === performanceTrend.length - 1
                      ? theme.colors.primary
                      : "#f8d971"
                  }
                />
              );
            })}
          </Svg>

          <View style={styles.chartLabels}>
            {performanceTrend.map((point, index) => (
              <Text key={`${point.label}-${index}`} style={styles.chartLabel}>
                {point.label}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Allocation</Text>
            <Text style={styles.sectionHint}>Diversified</Text>
          </View>

          {allocationData.map((item) => (
            <View key={item.label} style={styles.allocationRow}>
              <View style={styles.allocationMeta}>
                <View
                  style={[styles.allocationDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.allocationLabel}>{item.label}</Text>
              </View>
              <Text style={styles.allocationValue}>{item.value}%</Text>
              <View style={styles.allocationBar}>
                <View
                  style={[
                    styles.allocationFill,
                    {
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
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
                  <Text style={styles.positionAvatarText}>
                    {position.symbol[0]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.positionSymbol}>{position.symbol}</Text>
                  <Text style={styles.positionName}>{position.name}</Text>
                </View>
              </View>
              <View style={styles.positionStats}>
                <Text style={styles.positionValue}>
                  {formatCurrency(position.marketValue)}
                </Text>
                <Text
                  style={[
                    styles.positionChange,
                    position.changePercent >= 0
                      ? styles.positive
                      : styles.negative,
                  ]}
                >
                  {position.changePercent >= 0 ? "+" : ""}
                  {position.changePercent.toFixed(1)}%
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  eyebrow: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "700",
    letterSpacing: 1,
  },
  title: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.subtitle,
    fontWeight: "700",
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
    fontWeight: "700",
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
    fontWeight: "700",
    color: theme.colors.text,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontWeight: "700",
    color: theme.colors.text,
  },
  highlight: {
    color: theme.colors.success,
  },
  insightCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.xl,
  },
  sectionHeader: {
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: "700",
    color: theme.colors.text,
  },
  sectionHint: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -4,
  },
  chartLabel: {
    color: theme.colors.mutedText,
    fontSize: 10,
    fontWeight: "600",
  },
  allocationRow: {
    marginBottom: theme.spacing.md,
    position: "relative",
  },
  allocationMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  allocationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.sm,
  },
  allocationLabel: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  allocationValue: {
    position: "absolute",
    right: 0,
    top: 0,
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    fontWeight: "700",
  },
  allocationBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#1e293b",
    overflow: "hidden",
    marginTop: theme.spacing.xs,
  },
  allocationFill: {
    height: "100%",
    borderRadius: 999,
  },
  positionList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  positionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  positionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  positionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  positionAvatarText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: theme.typography.body,
  },
  positionSymbol: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: theme.typography.body,
  },
  positionName: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs / 2,
  },
  positionStats: {
    alignItems: "flex-end",
  },
  positionValue: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  positionChange: {
    fontSize: theme.typography.caption,
    fontWeight: "700",
    marginTop: theme.spacing.xs / 2,
  },
  positive: {
    color: theme.colors.success,
  },
  negative: {
    color: theme.colors.danger,
  },
});
