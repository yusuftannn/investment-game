import React, { useState } from "react";
import { Section, SettingsPage, ToggleRow } from "./SettingsDetailScreens";
import { TouchableOpacity,  StyleSheet,  Text, View } from "react-native";
import { theme } from "../../theme";

export function AlertsScreen() {
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [volumeAlerts, setVolumeAlerts] = useState(false);
  const [newsAlerts, setNewsAlerts] = useState(true);

  const alerts = [
    {
      id: 1,
      symbol: "AAPL",
      condition: "Above $240",
      active: true,
    },
    {
      id: 2,
      symbol: "BTC/USD",
      condition: "Below $95,000",
      active: true,
    },
    {
      id: 3,
      symbol: "TSLA",
      condition: "Volume > 5M",
      active: false,
    },
  ];

  return (
    <SettingsPage title="Price Alerts" subtitle="Manage your trading alerts">
      <Section title="Alert Preferences">
        <ToggleRow
          title="Price Alerts"
          subtitle="Notify when price targets are reached"
          value={priceAlerts}
          onChange={setPriceAlerts}
        />

        <ToggleRow
          title="Volume Alerts"
          subtitle="Notify on unusual trading volume"
          value={volumeAlerts}
          onChange={setVolumeAlerts}
        />

        <ToggleRow
          title="News Alerts"
          subtitle="Notify when important news is published"
          value={newsAlerts}
          onChange={setNewsAlerts}
        />
      </Section>

      <Section title="Active Alerts">
        {alerts.map((alert, index) => (
          <TouchableOpacity
            key={alert.id}
            style={[
              styles.choiceRow,
              index === alerts.length - 1 && {
                borderBottomWidth: 0,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{alert.symbol}</Text>
              <Text style={styles.rowSubtitle}>{alert.condition}</Text>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
                backgroundColor: alert.active
                  ? `${theme.colors.success}20`
                  : `${theme.colors.border}`,
              }}
            >
              <Text
                style={{
                  color: alert.active
                    ? theme.colors.success
                    : theme.colors.mutedText,
                  fontWeight: "600",
                  fontSize: theme.typography.caption,
                }}
              >
                {alert.active ? "Active" : "Paused"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </Section>

      <TouchableOpacity
        style={{
          marginTop: theme.spacing.lg,
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radius.md,
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: theme.colors.secondary,
            fontWeight: "700",
          }}
        >
          + Create New Alert
        </Text>
      </TouchableOpacity>
    </SettingsPage>
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
