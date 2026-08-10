import React, { useEffect, useState } from "react";
import { Section, SettingsPage, ToggleRow } from "./SettingsDetailScreens";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { theme } from "../../theme";
import { PriceAlert } from "../../types";
import { getAlerts, saveAlerts } from "../../utils/alertsStorage";

const defaultPreferences = {
  priceAlerts: true,
  volumeAlerts: false,
  newsAlerts: true,
};

export function AlertsScreen() {
  const [priceAlerts, setPriceAlerts] = useState(defaultPreferences.priceAlerts);
  const [volumeAlerts, setVolumeAlerts] = useState(defaultPreferences.volumeAlerts);
  const [newsAlerts, setNewsAlerts] = useState(defaultPreferences.newsAlerts);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newCondition, setNewCondition] = useState("");

  useEffect(() => {
    const loadAlerts = async () => {
      const stored = await getAlerts();
      setAlerts(stored);
    };

    loadAlerts();
  }, []);

  const handleAddAlert = async () => {
    const symbol = newSymbol.trim().toUpperCase();
    const condition = newCondition.trim();

    if (!symbol || !condition) {
      Alert.alert("Eksik Alan", "Lütfen sembol ve koşul bilgilerini girin.");
      return;
    }

    const nextAlert: PriceAlert = {
      id: Date.now(),
      symbol,
      condition,
      active: true,
    };

    const nextAlerts = [nextAlert, ...alerts];
    setAlerts(nextAlerts);
    await saveAlerts(nextAlerts);
    setNewSymbol("");
    setNewCondition("");
    setShowCreateForm(false);
  };

  const handleToggleAlert = async (id: number) => {
    const nextAlerts = alerts.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item,
    );
    setAlerts(nextAlerts);
    await saveAlerts(nextAlerts);
  };

  const handleRemoveAlert = async (id: number) => {
    const nextAlerts = alerts.filter((item) => item.id !== id);
    setAlerts(nextAlerts);
    await saveAlerts(nextAlerts);
  };

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
        {alerts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No alerts configured yet.</Text>
            <Text style={styles.emptySubtext}>
              Create a custom price alert and keep track of your positions.
            </Text>
          </View>
        ) : null}

        {alerts.map((alert, index) => (
          <View
            key={alert.id}
            style={[
              styles.choiceRow,
              index === alerts.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{alert.symbol}</Text>
              <Text style={styles.rowSubtitle}>{alert.condition}</Text>
            </View>

            <View style={styles.alertControls}>
              <Switch
                value={alert.active}
                onValueChange={() => handleToggleAlert(alert.id)}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.text}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveAlert(alert.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Section>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateForm((value) => !value)}
      >
        <Text style={styles.createButtonText}>
          {showCreateForm ? "Cancel" : "+ Create New Alert"}
        </Text>
      </TouchableOpacity>

      {showCreateForm ? (
        <Section title="New Alert">
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Symbol</Text>
            <TextInput
              value={newSymbol}
              onChangeText={setNewSymbol}
              placeholder="AAPL or BTC/USD"
              placeholderTextColor={theme.colors.mutedText}
              style={styles.input}
              autoCapitalize="characters"
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Condition</Text>
            <TextInput
              value={newCondition}
              onChangeText={setNewCondition}
              placeholder="Above $240"
              placeholderTextColor={theme.colors.mutedText}
              style={styles.input}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddAlert}>
            <Text style={styles.addButtonText}>Save Alert</Text>
          </TouchableOpacity>
        </Section>
      ) : null}
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
  emptyBox: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  emptySubtext: {
    color: theme.colors.mutedText,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  alertControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  deleteButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  deleteText: {
    color: theme.colors.danger,
    fontWeight: "700",
  },
  createButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    alignItems: "center",
  },
  createButtonText: {
    color: theme.colors.secondary,
    fontWeight: "700",
  },
  formRow: {
    marginBottom: theme.spacing.md,
  },
  formLabel: {
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
  },
  addButton: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: theme.colors.secondary,
    fontWeight: "700",
  },
});
