import React, { useState } from "react";
import { Section, SettingsPage, ChoiceRow } from "./SettingsDetailScreens";
import { StyleSheet,  Text } from "react-native";
import { theme } from "../../theme";

export function LanguageScreen() {
  const [language, setLanguage] = useState("English");
  return (
    <SettingsPage title="Language" subtitle="Select your preferred language">
      <Section>
        {["English", "Türkçe"].map((item) => (
          <ChoiceRow
            key={item}
            title={item}
            selected={language === item}
            onPress={() => setLanguage(item)}
          />
        ))}
      </Section>
      <Text style={styles.note}>
        More languages will be added in future versions.
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