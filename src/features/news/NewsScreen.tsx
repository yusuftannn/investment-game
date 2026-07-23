import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { theme } from "../../theme";
import { newsCategoryLabels, NewsCategory, newsItems } from "./newsData";

const categories = Object.keys(newsCategoryLabels) as NewsCategory[];

export function NewsScreen() {
  const navigation = useNavigation();
  const [category, setCategory] = useState<NewsCategory>("all");
  const filteredNews = useMemo(
    () => category === "all" ? newsItems : newsItems.filter((item) => item.category === category),
    [category],
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>MARKET INTELLIGENCE</Text>
            <Text style={styles.title}>News</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {categories.map((item) => {
            const selected = category === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.filterButton, selected && styles.filterButtonSelected]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                  {newsCategoryLabels[item]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filteredNews.map((item, index) => (
          <View key={item.id} style={[styles.newsCard, index === 0 && styles.featuredCard]}>
            <View style={styles.cardTopRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{newsCategoryLabels[item.category]}</Text>
              </View>
              <Text style={styles.time}>{item.publishedAt}</Text>
            </View>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.source}>{item.source}</Text>
              {item.symbol ? <Text style={styles.symbol}>{item.symbol}</Text> : null}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: theme.spacing.xxl },
  header: { flexDirection: "row", alignItems: "center", marginBottom: theme.spacing.xl },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  headerCopy: { marginLeft: theme.spacing.md },
  eyebrow: { color: theme.colors.primary, fontSize: 11, fontWeight: "700", letterSpacing: 1.2 },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: "800", marginTop: 2 },
  filters: { gap: theme.spacing.sm, paddingBottom: theme.spacing.lg },
  filterButton: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: 999, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  filterButtonSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterText: { color: theme.colors.mutedText, fontWeight: "700" },
  filterTextSelected: { color: theme.colors.background },
  newsCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.md },
  featuredCard: { borderColor: `${theme.colors.primary}80` },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoryBadge: { backgroundColor: `${theme.colors.primary}18`, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, borderRadius: 999 },
  categoryBadgeText: { color: theme.colors.primary, fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  time: { color: theme.colors.mutedText, fontSize: theme.typography.caption },
  newsTitle: { color: theme.colors.text, fontSize: 18, lineHeight: 25, fontWeight: "800", marginTop: theme.spacing.md },
  summary: { color: theme.colors.mutedText, lineHeight: 21, marginTop: theme.spacing.sm },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: theme.spacing.md },
  source: { color: theme.colors.text, fontSize: theme.typography.caption, fontWeight: "600" },
  symbol: { color: theme.colors.primary, fontSize: theme.typography.caption, fontWeight: "800" },
});
