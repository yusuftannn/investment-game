import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { theme } from "../../theme";
import { RootStackParamList } from "../../types";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DepositScreen() {
  const [amount, setAmount] = useState("1000");
  const navigation = useNavigation<NavProp>();
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>

          <View>
            <Text style={styles.symbol}>Deposit</Text>
            <Text style={styles.sub}>Add funds to your wallet</Text>
          </View>
        </View>
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>Deposit</Text>
          <Text style={styles.title}>Add funds to continue trading</Text>
          <Text style={styles.subtitle}>
            Fast deposits make it easy to enter new positions.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.colors.mutedText}
          />

          <View style={styles.methodRow}>
            <View style={styles.methodChip}>
              <Ionicons
                name="card-outline"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.methodText}>Card</Text>
            </View>
            <View style={styles.methodChip}>
              <Ionicons
                name="cash-outline"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.methodText}>Bank</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>
              Deposit ${amount || "0"}
            </Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  backButton: {
    marginRight: theme.spacing.md,
  },

  symbol: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: theme.typography.subtitle,
  },

  sub: {
    color: theme.colors.mutedText,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: theme.typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    marginTop: theme.spacing.sm,
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.mutedText,
    fontSize: theme.typography.body,
  },
  card: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: `${theme.colors.background}cc`,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  methodRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  methodChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
  },
  methodText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: "center",
  },
  primaryButtonText: {
    color: theme.colors.secondary,
    fontWeight: "700",
  },
});
