import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme";
import { marketDataService } from "../../services/market-data";
import { formatCurrency } from "../../utils/formatters";
import { Market, RootStackParamList } from "../../types";

const quickActions = [
  {
    label: "Deposit",
    icon: "add-circle-outline",
    accent: theme.colors.primary,
  },
  { label: "Trade", icon: "swap-horizontal-outline", accent: "#60a5fa" },
  { label: "Watchlist", icon: "star-outline", accent: "#34d399" },
  { label: "Goals", icon: "flag-outline", accent: "#a78bfa" },
  { label: "Challenges", icon: "trophy-outline", accent: "#f97316" },
  { label: "News", icon: "newspaper-outline", accent: "#fb923c" },
];

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [marketHighlights, setMarketHighlights] = useState<Market[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingHighlights, setIsLoadingHighlights] = useState(true);

  const loadMarketHighlights = useCallback(async () => {
    try {
      setIsLoadingHighlights(true);
      const data = await marketDataService.getMarkets();
      const sorted = [...data].sort((a, b) => b.change - a.change).slice(0, 3);
      setMarketHighlights(sorted);
    } finally {
      setIsLoadingHighlights(false);
    }
  }, []);

  useEffect(() => {
    loadMarketHighlights();
  }, [loadMarketHighlights]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMarketHighlights();
    setRefreshing(false);
  };

  const averageMove = useMemo(() => {
    if (!marketHighlights.length) return 0;
    return (
      marketHighlights.reduce((sum, item) => sum + item.change, 0) /
      marketHighlights.length
    );
  }, [marketHighlights]);

  const sentimentLabel =
    averageMove >= 0
      ? "Risk appetite is positive"
      : "Risk appetite is cautious";
  const topMover = marketHighlights[0];
  const sentimentBarWidth = Math.min(
    100,
    Math.max(25, Math.abs(averageMove) * 8 + 30),
  );

  const handleQuickAction = (label: string) => {
    switch (label) {
      case "Deposit":
        navigation.navigate("Deposit");
        break;
      case "Trade":
        navigation.navigate("Main");
        break;
      case "Watchlist":
        navigation.navigate("Watchlist");
        break;
      case "Goals":
        navigation.navigate("Goals");
        break;
      case "Challenges":
        navigation.navigate("Challenges");
        break;
      case "News":
        navigation.navigate("News");
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>Good morning</Text>
            <Text style={styles.title}>Yusuf, your portfolio is thriving.</Text>
          </View>

          <View style={styles.headerActions}>
            {/* Alerts */}
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate("Alerts")}
            >
              <Ionicons
                name="alarm-outline"
                size={22}
                color={theme.colors.text}
              />

              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={theme.colors.text}
              />

              <View style={styles.badge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>

            {/* Profile */}
            {/* <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.avatarText}>Y</Text>
            </TouchableOpacity> */}
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

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightLabel}>Market sentiment</Text>
            <Text
              style={[
                styles.insightValue,
                {
                  color:
                    averageMove >= 0
                      ? theme.colors.success
                      : theme.colors.warning,
                },
              ]}
            >
              {averageMove >= 0 ? "+" : ""}
              {averageMove.toFixed(1)}%
            </Text>
          </View>

          <Text style={styles.insightText}>{sentimentLabel}</Text>

          <View style={styles.sentimentBar}>
            <View
              style={[
                styles.sentimentFill,
                {
                  width: `${sentimentBarWidth}%`,
                  backgroundColor:
                    averageMove >= 0
                      ? theme.colors.success
                      : theme.colors.warning,
                },
              ]}
            />
          </View>

          <Text style={styles.insightMeta}>
            {topMover
              ? `Top mover: ${topMover.symbol} ${topMover.change >= 0 ? "+" : ""}${topMover.change.toFixed(1)}%`
              : "Tracking market movers..."}
          </Text>
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
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: `${action.accent}20` },
                ]}
              >
                <Ionicons
                  name={action.icon as never}
                  size={18}
                  color={action.accent}
                />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.sectionHeader}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Main")}
        >
          <Text style={styles.sectionTitle}>Market pulse</Text>
          <Text style={styles.sectionLink}>Open market</Text>
        </TouchableOpacity>

        <View style={styles.listCard}>
          {isLoadingHighlights ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading market movers...</Text>
            </View>
          ) : (
            marketHighlights.map((asset) => (
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
                  <Text style={styles.assetPrice}>
                    {formatCurrency(asset.price)}
                  </Text>
                  <Text
                    style={[
                      styles.assetChange,
                      asset.change >= 0 ? styles.positive : styles.negative,
                    ]}
                  >
                    {asset.change >= 0 ? "+" : ""}
                    {asset.change.toFixed(1)}%
                  </Text>
                </View>
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
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
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
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    marginTop: theme.spacing.xs,
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    maxWidth: 260,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.xs,
  },
  balance: {
    fontSize: 30,
    fontWeight: "700",
    color: theme.colors.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  heroStatsRow: {
    flexDirection: "row",
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
    fontWeight: "600",
    color: theme.colors.text,
  },
  insightCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insightLabel: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  insightText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  sentimentBar: {
    height: 8,
    backgroundColor: `${theme.colors.border}80`,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: theme.spacing.md,
  },
  sentimentFill: {
    height: "100%",
    borderRadius: 999,
  },
  insightMeta: {
    marginTop: theme.spacing.sm,
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: "700",
    color: theme.colors.text,
  },
  sectionLink: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  actionCard: {
    width: "47%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  actionLabel: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  listCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  assetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  assetInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  assetIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  assetIconText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  assetSymbol: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  assetName: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
  },
  assetOutcome: {
    alignItems: "flex-end",
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.mutedText,
  },
  assetPrice: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  assetChange: {
    fontSize: theme.typography.caption,
    fontWeight: "600",
  },
  positive: {
    color: theme.colors.success,
  },
  negative: {
    color: theme.colors.danger,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
