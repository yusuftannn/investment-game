import React, { useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { theme } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

type MarketDetailRouteProp = RouteProp<RootStackParamList, "MarketDetail">;
type NavProp = NativeStackNavigationProp<RootStackParamList, "MarketDetail">;

function generateMockHistory(seed = 1, points = 40) {
  const arr: number[] = [];
  let v = 100 + seed * 10;
  for (let i = 0; i < points; i++) {
    v += Math.sin((i + seed) / 3) * 2 + (Math.random() - 0.5) * 1.5;
    arr.push(parseFloat(v.toFixed(2)));
  }
  return arr;
}

export function MarketDetailScreen() {
  const route = useRoute<MarketDetailRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { symbol } = route.params;

  const history = useMemo(() => generateMockHistory(symbol.length), [symbol]);

  const { width } = Dimensions.get("window");
  const chartWidth = width - theme.spacing.lg * 2;
  const chartHeight = 160;

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

  const latest = history[history.length - 1];
  const previous = history[history.length - 2] ?? latest;
  const change = ((latest - previous) / previous) * 100 || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.sub}>{`${history.length} points`}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.price}>${latest.toFixed(2)}</Text>
          <Text
            style={[
              styles.change,
              change >= 0 ? styles.positive : styles.negative,
            ]}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </Text>
        </View>

        <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
          <Path
            d={path}
            stroke={theme.colors.primary}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  backButton: { marginRight: theme.spacing.md },
  symbol: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: theme.typography.subtitle,
  },
  sub: { color: theme.colors.mutedText },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  price: { color: theme.colors.text, fontWeight: "700", fontSize: 28 },
  change: { fontWeight: "700" },
  positive: { color: theme.colors.success },
  negative: { color: theme.colors.danger },
  svg: { marginTop: theme.spacing.sm },
});
