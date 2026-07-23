import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { marketDataService } from "../../services/market-data";
import { formatCurrency } from "../../utils/formatters";
import { theme } from "../../theme";
import { Market, MarketCategory } from "../../types";
import { useNavigation } from "@react-navigation/native";
import {
  getWatchlistSymbols,
  toggleWatchlistSymbol,
} from "../../utils/watchlistStorage";
import { newsCategoryLabels, newsItems } from "../news/newsData";

export function MarketsScreen() {
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] =
    useState<MarketCategory>("us");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filtered, setFiltered] = useState<Market[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await marketDataService.getMarkets();
    setMarkets(data);
    setFiltered(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
    getWatchlistSymbols().then(setWatchlistSymbols);
  }, [load]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const categoryMarkets = markets.filter(
      (market) => market.market === selectedCategory,
    );
    setFiltered(
      q
        ? categoryMarkets.filter(
            (m) =>
              m.symbol.toLowerCase().includes(q) ||
              m.name.toLowerCase().includes(q),
          )
        : categoryMarkets,
    );
  }, [query, markets, selectedCategory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setWatchlistSymbols(await getWatchlistSymbols());
    setRefreshing(false);
  };

  const handleToggleWatchlist = async (symbol: string) => {
    const added = await toggleWatchlistSymbol(symbol);
    setWatchlistSymbols((current) =>
      added ? [...current, symbol] : current.filter((item) => item !== symbol),
    );
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons
                  name="close"
                  size={18}
                  color={theme.colors.mutedText}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          style={styles.categoryScroll}
        >
          {[
            { key: "us", label: "ABD" },
            { key: "bist", label: "BIST" },
            { key: "funds", label: "Fonlar" },
            { key: "crypto", label: "Kripto" },
          ].map((category) => {
            const isSelected = selectedCategory === category.key;
            return (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  isSelected && styles.categoryButtonSelected,
                ]}
                onPress={() =>
                  setSelectedCategory(category.key as MarketCategory)
                }
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.listCard}>
          {filtered.map((m) => (
            <TouchableOpacity
              key={m.symbol}
              style={styles.row}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("MarketDetail", { symbol: m.symbol })
              }
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

              <View style={styles.rightSection}>
                <View style={styles.right}>
                  <Text style={styles.price}>{formatCurrency(m.price)}</Text>
                  <Text
                    style={[
                      styles.change,
                      m.change >= 0 ? styles.positive : styles.negative,
                    ]}
                  >
                    {m.change >= 0 ? "+" : ""}
                    {m.change.toFixed(2)}%
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.watchlistButton}
                  onPress={(event) => {
                    event.stopPropagation();
                    handleToggleWatchlist(m.symbol);
                  }}
                >
                  <Ionicons
                    name={
                      watchlistSymbols.includes(m.symbol)
                        ? "star"
                        : "star-outline"
                    }
                    size={18}
                    color={
                      watchlistSymbols.includes(m.symbol)
                        ? theme.colors.primary
                        : theme.colors.mutedText
                    }
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.newsHeader} activeOpacity={0.8} onPress={() => navigation.navigate("News")}>
          <View>
            <Text style={styles.newsEyebrow}>MARKET INTELLIGENCE</Text>
            <Text style={styles.newsSectionTitle}>Latest news</Text>
          </View>
          <View style={styles.newsLinkRow}>
            <Text style={styles.newsLink}>See all</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.newsList}>
          {newsItems.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.newsRow}>
              <View style={styles.newsAccent} />
              <View style={styles.newsCopy}>
                <View style={styles.newsMeta}>
                  <Text style={styles.newsCategory}>{newsCategoryLabels[item.category]}</Text>
                  <Text style={styles.newsTime}>{item.publishedAt}</Text>
                </View>
                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.newsSource}>{item.source}{item.symbol ? ` · ${item.symbol}` : ""}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: "center", alignItems: "center" },
  content: { paddingBottom: theme.spacing.xxl },
  searchRow: { marginBottom: theme.spacing.lg },
  categoryScroll: { marginBottom: theme.spacing.lg },
  categoryList: { gap: theme.spacing.sm },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: { color: theme.colors.mutedText, fontWeight: "700" },
  categoryTextSelected: { color: theme.colors.background },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  left: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  avatarText: { color: theme.colors.primary, fontWeight: "700" },
  symbol: { color: theme.colors.text, fontWeight: "700" },
  name: { color: theme.colors.mutedText, fontSize: theme.typography.caption },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  watchlistButton: {
    marginLeft: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  price: { color: theme.colors.text, fontWeight: "700" },
  change: {
    marginTop: theme.spacing.xs / 2,
    fontSize: theme.typography.caption,
    fontWeight: "700",
  },
  positive: { color: theme.colors.success },
  negative: { color: theme.colors.danger },
  newsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: theme.spacing.xl, marginBottom: theme.spacing.md },
  newsEyebrow: { color: theme.colors.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  newsSectionTitle: { color: theme.colors.text, fontSize: theme.typography.subtitle, fontWeight: "800", marginTop: theme.spacing.xs },
  newsLinkRow: { flexDirection: "row", alignItems: "center" },
  newsLink: { color: theme.colors.primary, fontWeight: "700", marginRight: 2 },
  newsList: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, overflow: "hidden" },
  newsRow: { flexDirection: "row", padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  newsAccent: { width: 3, borderRadius: 2, backgroundColor: theme.colors.primary, marginRight: theme.spacing.md },
  newsCopy: { flex: 1 },
  newsMeta: { flexDirection: "row", justifyContent: "space-between", marginBottom: theme.spacing.xs },
  newsCategory: { color: theme.colors.primary, fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  newsTime: { color: theme.colors.mutedText, fontSize: 11 },
  newsTitle: { color: theme.colors.text, fontWeight: "700", lineHeight: 20 },
  newsSource: { color: theme.colors.mutedText, fontSize: 11, marginTop: theme.spacing.xs },
});
