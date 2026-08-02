import React, { useState } from "react";
import { Section, SettingsPage, ChoiceRow } from "./SettingsDetailScreens";
import { StyleSheet,  Text } from "react-native";
import { theme } from "../../theme";

export function AppearanceScreen() {
  const [mode, setMode] = useState("Dark");
  return (
    <SettingsPage title="Appearance" subtitle="Personalize how the app looks">
      <Section title="Theme">
        {["System default", "Light", "Dark"].map((item) => (
          <ChoiceRow
            key={item}
            title={item}
            selected={mode === item}
            onPress={() => setMode(item)}
          />
        ))}
      </Section>
      <Text style={styles.note}>
        Theme selection is saved for this session. The application currently
        uses the dark color palette.
      </Text>
    </SettingsPage>
  );
}
const styles = StyleSheet.create({
  note: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    lineHeight: 19,
  },
});