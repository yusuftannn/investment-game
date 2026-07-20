import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_STORAGE_KEY = 'investment-game:watchlist';

export async function getWatchlistSymbols(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function toggleWatchlistSymbol(symbol: string): Promise<boolean> {
  const current = await getWatchlistSymbols();
  const exists = current.includes(symbol);

  const next = exists
    ? current.filter((item) => item !== symbol)
    : [...current, symbol];

  await AsyncStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
  return !exists;
}
