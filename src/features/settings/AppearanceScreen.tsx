import React, { useState, useEffect } from "react";
import { Section, SettingsPage, ChoiceRow } from "./SettingsDetailScreens";
import { StyleSheet, Text } from "react-native";
import { theme } from "../../theme";
import { getSavedTheme, saveTheme, ThemeMode } from "../../utils/themeStorage";

export function AppearanceScreen() {
  const [mode, setMode] = useState<ThemeMode>("Dark");
  const options: ThemeMode[] = ["System default", "Light", "Dark"];

  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = await getSavedTheme();
      if (mounted && saved && options.includes(saved)) {
        setMode(saved);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSelect = (item: ThemeMode) => {
    setMode(item);
    saveTheme(item).catch(() => {
    });
  };
  return (
    <SettingsPage title="Appearance" subtitle="Personalize how the app looks">
      <Section title="Theme">
        {options.map((item) => (
          <ChoiceRow
            key={item}
            title={item}
            selected={mode === item}
                    onPress={() => onSelect(item)}
          />
        ))}
      </Section>
      <Text style={styles.note}>
        Theme selection is now persisted across app restarts. The application
                currently uses the dark color palette by default unless changed.
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