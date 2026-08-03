import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { theme } from "../../theme";

type PageProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function SettingsPage({ title, subtitle, children }: PageProps) {
  const navigation = useNavigation();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.pageTitle}>{title}</Text>
          <Text style={styles.pageSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
    </ScreenContainer>
  );
}

export function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export function ToggleRow({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.text}
      />
    </View>
  );
}

export function ChoiceRow({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.choiceRow}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.rowTitle}>{title}</Text>
      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        size={22}
        color={selected ? theme.colors.primary : theme.colors.mutedText}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginRight: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  headerText: { flex: 1 },
  pageTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: theme.typography.subtitle,
  },
  pageSubtitle: { color: theme.colors.mutedText, marginTop: 2 },
  content: { paddingBottom: theme.spacing.xxl },
  section: { marginBottom: theme.spacing.lg },
  sectionTitle: {
    color: theme.colors.mutedText,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    marginLeft: 2,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowText: { flex: 1, paddingRight: theme.spacing.md },
  rowTitle: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: theme.typography.body,
  },
  rowSubtitle: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginTop: 3,
  },
  choiceRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  note: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    lineHeight: 19,
  },
  infoBlock: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  infoText: { color: theme.colors.mutedText, lineHeight: 21 },
  aboutIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${theme.colors.primary}18`,
    marginTop: theme.spacing.md,
  },
  aboutTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: "700",
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  aboutVersion: {
    color: theme.colors.primary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  aboutText: {
    color: theme.colors.mutedText,
    textAlign: "center",
    lineHeight: 22,
    marginVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  value: { color: theme.colors.mutedText },
});
