import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Market } from "../../types";
import { theme } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Line, Path } from "react-native-svg";
import { marketDataService } from "../../services/market-data";

type MarketDetailRouteProp = RouteProp<RootStackParamList, "MarketDetail">;
type NavProp = NativeStackNavigationProp<RootStackParamList, "MarketDetail">;
type Range = "1G" | "1H" | "4H" | "1A" | "1Y";

const ranges: Range[] = ["1G", "1H", "4H", "1A", "1Y"];

function generateMockHistory(price: number, seed: number, points = 40) {
  return Array.from({ length: points }, (_, index) => {
    const trend = Math.sin((index + seed) / 4) * 0.018;
    const wave = Math.cos((index + seed) / 2.6) * 0.009;
    return price * (1 + trend + wave - (points - index) * 0.0008);
  });
}

function getCurrency(market: Market["market"]) {
  return market === "bist" || market === "funds" ? "₺" : "$";
}

function formatPrice(price: number, currency: string) {
  const decimals = price < 10 ? 4 : 2;
  return `${currency}${price.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

function getMarketLabel(market: Market["market"]) {
  return {
    us: "ABD piyasaları",
    bist: "Borsa İstanbul",
    funds: "Yatırım fonu",
    crypto: "Kripto varlık",
  }[market];
}

export function MarketDetailScreen() {
  const route = useRoute<MarketDetailRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { width } = useWindowDimensions();
  const { symbol } = route.params;
  const [asset, setAsset] = useState<Market | null>(null);
  const [range, setRange] = useState<Range>("1G");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    marketDataService.getMarkets().then((markets) => {
      setAsset(markets.find((market) => market.symbol === symbol) ?? null);
    });
  }, [symbol]);

  const history = useMemo(
    () => (asset ? generateMockHistory(asset.price, symbol.length) : []),
    [asset, symbol],
  );
  const chartWidth = Math.max(
    width - theme.spacing.lg * 2 - theme.spacing.lg * 2,
    240,
  );
  const chartHeight = 190;

  const min = Math.min(...history);
  const max = Math.max(...history);

  const path = useMemo(() => {
    if (history.length === 0) return "";
    return history
      .map((v, i) => {
        const x = (i / (history.length - 1)) * chartWidth;
        const y = chartHeight - ((v - min) / (max - min || 1)) * chartHeight;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [history, chartWidth, chartHeight, min, max]);

  const latest = asset?.price ?? 0;
  const first = history[0] ?? latest;
  const periodChange = ((latest - first) / first) * 100 || 0;
  const currency = asset ? getCurrency(asset.market) : "$";

  if (!asset) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.eyebrow}>{getMarketLabel(asset.market)}</Text>
            <Text style={styles.symbol}>{asset.symbol}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsFavorite((value) => !value)}
          >
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={22}
              color={isFavorite ? theme.colors.primary : theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.identityRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>{asset.symbol.slice(0, 2)}</Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name}>{asset.name}</Text>
            <Text style={styles.marketStatus}>
              <Text style={styles.statusDot}>●</Text> Piyasa açık
            </Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{formatPrice(latest, currency)}</Text>
            <Text style={styles.updated}>Son güncelleme · şimdi</Text>
          </View>
          <View
            style={[
              styles.changePill,
              periodChange >= 0
                ? styles.positiveBackground
                : styles.negativeBackground,
            ]}
          >
            <Ionicons
              name={periodChange >= 0 ? "trending-up" : "trending-down"}
              size={15}
              color={
                periodChange >= 0 ? theme.colors.success : theme.colors.danger
              }
            />
            <Text
              style={[
                styles.changeText,
                periodChange >= 0 ? styles.positive : styles.negative,
              ]}
            >
              {periodChange >= 0 ? "+" : ""}
              {periodChange.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Fiyat hareketi</Text>
            <Text style={styles.chartCurrency}>{currency}</Text>
          </View>
          <View style={styles.chartWrap}>
            <View style={styles.gridLines} pointerEvents="none">
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>
            <Svg width={chartWidth} height={chartHeight}>
              <Path
                d={path}
                stroke={theme.colors.primary}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Line
                x1={chartWidth - 1}
                y1="0"
                x2={chartWidth - 1}
                y2={chartHeight}
                stroke={`${theme.colors.primary}55`}
                strokeDasharray="4 5"
              />
            </Svg>
          </View>
          <View style={styles.rangeRow}>
            {ranges.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.rangeButton,
                  range === item && styles.rangeButtonActive,
                ]}
                onPress={() => setRange(item)}
              >
                <Text
                  style={[
                    styles.rangeText,
                    range === item && styles.rangeTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>Piyasa özeti</Text>
            <Text style={styles.liveText}>GÜNCEL</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Gün içi en yüksek</Text>
              <Text style={styles.statValue}>
                {formatPrice(Math.max(...history), currency)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Gün içi en düşük</Text>
              <Text style={styles.statValue}>
                {formatPrice(Math.min(...history), currency)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Önceki kapanış</Text>
              <Text style={styles.statValue}>
                {formatPrice(first, currency)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Değişim</Text>
              <Text
                style={[
                  styles.statValue,
                  periodChange >= 0 ? styles.positive : styles.negative,
                ]}
              >
                {periodChange >= 0 ? "+" : ""}
                {periodChange.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tradeButton}
          onPress={() => navigation.navigate("Main", { screen: "Trade" })}
        >
          <Text style={styles.tradeButtonText}>İşlem yap</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={theme.colors.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  content: { padding: theme.spacing.lg, paddingBottom: 112 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { flex: 1, marginLeft: theme.spacing.md },
  eyebrow: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  symbol: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: "800",
    marginTop: 2,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: theme.radius.md,
    backgroundColor: `${theme.colors.primary}20`,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}55`,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: theme.colors.primary, fontSize: 16, fontWeight: "800" },
  identityText: { marginLeft: theme.spacing.md },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "700",
  },
  marketStatus: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginTop: 5,
  },
  statusDot: { color: theme.colors.success },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  price: { color: theme.colors.text, fontSize: 34, fontWeight: "800" },
  updated: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginTop: 5,
  },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    gap: 5,
  },
  positiveBackground: { backgroundColor: `${theme.colors.success}18` },
  negativeBackground: { backgroundColor: `${theme.colors.danger}18` },
  changeText: { fontWeight: "800", fontSize: theme.typography.caption },
  positive: { color: theme.colors.success },
  negative: { color: theme.colors.danger },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "800",
  },
  chartCurrency: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    fontWeight: "700",
  },
  chartWrap: { marginTop: theme.spacing.lg, height: 190, overflow: "hidden" },
  gridLines: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  gridLine: { height: 1, backgroundColor: theme.colors.border },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  rangeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  rangeButtonActive: { backgroundColor: `${theme.colors.primary}20` },
  rangeText: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    fontWeight: "700",
  },
  rangeTextActive: { color: theme.colors.primary },
  statsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  liveText: {
    color: theme.colors.success,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: theme.spacing.lg,
  },
  stat: { width: "50%" },
  statLabel: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginBottom: 6,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "700",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: `${theme.colors.background}F2`,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  tradeButton: {
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  tradeButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.body,
    fontWeight: "800",
  },
});
