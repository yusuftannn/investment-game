import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { theme } from "../../theme";
import { useAppStore } from "../../store";
import { useNavigation } from "@react-navigation/native";

export function ProfileScreen() {
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const setAuthStatus = useAppStore((state) => state.setAuthStatus);
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    setAuthenticated(false);
    setAuthStatus("unauthenticated");
  };

  const user = {
    name: "Yusuf Tan",
    email: "yusuf@example.com",
    avatarUrl: "",
    portfolioValue: 12458.72,
    watchlistCount: 8,
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Portfolio</Text>
        <Text style={styles.cardValue}>
          ₺{user.portfolioValue.toLocaleString()}
        </Text>
      </View>

      <View style={styles.rowCards}>
        <View style={[styles.smallCard, styles.smallCardLeft]}>
          <Text style={styles.smallCardTitle}>Watchlist</Text>
          <Text style={styles.smallCardValue}>{user.watchlistCount}</Text>
        </View>
        <View style={[styles.smallCard, styles.smallCardRight]}>
          <Text style={styles.smallCardTitle}>Trades</Text>
          <Text style={styles.smallCardValue}>0</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => {}}>
          <Text style={styles.primaryButtonText}>Profili Düzenle</Text>
        </Pressable>
        <Pressable
          style={styles.ghostButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.ghostButtonText}>Ayarlar</Text>
        </Pressable>
        <Pressable style={styles.ghostButton} onPress={handleLogout}>
          <Text style={styles.ghostButtonText}>Çıkış Yap</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 28,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  info: {
    marginLeft: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.title,
    color: theme.colors.text,
    fontWeight: "600",
  },
  email: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedText,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.sm,
  },
  cardValue: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: "700",
  },
  rowCards: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  smallCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 10,
  },
  smallCardLeft: {
    marginRight: theme.spacing.sm / 2,
  },
  smallCardRight: {
    marginLeft: theme.spacing.sm / 2,
  },
  smallCardTitle: {
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.xs,
  },
  smallCardValue: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: "600",
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  primaryButtonText: {
    color: theme.colors.secondary,
    fontWeight: "600",
  },
  ghostButton: {
    backgroundColor: "transparent",
    paddingVertical: theme.spacing.md,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  ghostButtonText: {
    color: theme.colors.text,
  },
});
