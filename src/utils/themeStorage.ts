import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'investment-game:theme';

export type ThemeMode = 'System default' | 'Light' | 'Dark';

export async function getSavedTheme(): Promise<ThemeMode | null> {
  try {
    const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) return null;
    return stored as ThemeMode;
  } catch (err) {
    return null;
  }
}

export async function saveTheme(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (err) {
    // ignore write errors
  }
}
