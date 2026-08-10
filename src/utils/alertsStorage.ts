import AsyncStorage from '@react-native-async-storage/async-storage';
import { PriceAlert } from '../types';

const ALERTS_STORAGE_KEY = 'investment-game:price-alerts';

export async function getAlerts(): Promise<PriceAlert[]> {
  try {
    const stored = await AsyncStorage.getItem(ALERTS_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as PriceAlert[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveAlerts(alerts: PriceAlert[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // ignore write errors for this demo app
  }
}
