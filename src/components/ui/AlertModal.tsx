import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../theme';
import { PriceAlert } from '../../types';
import { getAlerts, saveAlerts } from '../../utils/alertsStorage';

type Props = {
  visible: boolean;
  symbol: string;
  onClose: () => void;
  onSaved?: (alert: PriceAlert) => void;
};

export default function AlertModal({ visible, symbol, onClose, onSaved }: Props) {
  const [target, setTarget] = useState<string>('');
  const [dir, setDir] = useState<'above' | 'below'>('above');

  async function handleSave() {
    const value = parseFloat(target);
    if (Number.isNaN(value)) {
      return onClose();
    }

    const condition = dir === 'above' ? `>=${value}` : `<=${value}`;
    const alerts = await getAlerts();
    const newAlert: PriceAlert = {
      id: Date.now(),
      symbol,
      condition,
      active: true,
    };
    alerts.push(newAlert);
    await saveAlerts(alerts);
    onSaved?.(newAlert);
    onClose();
  }

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <Text style={styles.title}>Create Price Alert</Text>
          <Text style={styles.label}>Symbol</Text>
          <Text style={styles.symbol}>{symbol}</Text>

          <Text style={styles.label}>Condition</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.dirButton, dir === 'above' && styles.dirActive]}
              onPress={() => setDir('above')}
            >
              <Text style={styles.dirText}>Above</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dirButton, dir === 'below' && styles.dirActive]}
              onPress={() => setDir('below')}
            >
              <Text style={styles.dirText}>Below</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
            placeholder="Price (e.g. 123.45)"
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: '800' },
  label: {
    color: theme.colors.mutedText,
    marginTop: theme.spacing.md,
    marginBottom: 6,
    fontSize: theme.typography.caption,
  },
  symbol: { color: theme.colors.text, fontWeight: '800', fontSize: 16 },
  row: { flexDirection: 'row', gap: 8, marginBottom: theme.spacing.sm },
  dirButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dirActive: { backgroundColor: `${theme.colors.primary}20`, borderColor: theme.colors.primary },
  dirText: { color: theme.colors.text, fontWeight: '700' },
  input: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.md, gap: 8 },
  cancel: { padding: 10 },
  cancelText: { color: theme.colors.mutedText },
  save: { backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: theme.radius.sm },
  saveText: { color: theme.colors.background, fontWeight: '800' },
});
