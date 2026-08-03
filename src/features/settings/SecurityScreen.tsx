import React, { useState } from "react";
import { Section, SettingsPage, ChoiceRow, ToggleRow } from "./SettingsDetailScreens";
import { StyleSheet,  Text, TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
    

export function SecurityScreen() {
  const [biometric, setBiometric] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  return (
    <SettingsPage title="Security" subtitle="Protect your account">
      <Section title="Authentication">
        <ToggleRow
          title="Biometric login"
          subtitle="Use Face ID or fingerprint"
          value={biometric}
          onChange={setBiometric}
        />
        <ToggleRow
          title="Two-factor authentication"
          subtitle="Add an extra verification step"
          value={twoFactor}
          onChange={setTwoFactor}
        />
      </Section>
      <Section title="Password">
        <TouchableOpacity style={styles.choiceRow} activeOpacity={0.8}>
          <Text style={styles.rowTitle}>Change password</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.mutedText}
          />
        </TouchableOpacity>
      </Section>
    </SettingsPage>
  );
}

const styles = StyleSheet.create({
  rowTitle: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: theme.typography.body,
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
});