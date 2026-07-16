import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme";
import { tradingService } from "../../services/trading";
import { portfolioService } from "../../services/portfolio";
import { formatCurrency } from "../../utils/formatters";

type TradeMode = "spot" | "margin";
type TradeSide = "buy" | "sell";
type PositionType = "long" | "short";
type Position = {
  symbol: string;
  side: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  status: "open" | "closed";
};

const assets = [
  { symbol: "AAPL", name: "Apple", price: "193.40" },
  { symbol: "NVDA", name: "NVIDIA", price: "120.75" },
  { symbol: "TSLA", name: "Tesla", price: "247.10" },
];

export function TradeScreen() {
  const [mode, setMode] = useState<TradeMode>("spot");
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [side, setSide] = useState<TradeSide>("buy");
  const [positionType, setPositionType] = useState<PositionType>("long");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState(selectedAsset.price);
  const [leverage, setLeverage] = useState(3);
  const [statusText, setStatusText] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);

  const notional = useMemo(() => {
    const parsedQuantity = Number(quantity) || 0;
    const parsedPrice = Number(price) || 0;
    return parsedQuantity * parsedPrice;
  }, [quantity, price]);

  const estimatedMargin = useMemo(() => {
    if (mode === "spot") {
      return notional;
    }

    return notional / leverage;
  }, [mode, notional, leverage]);

  const fee = useMemo(() => notional * 0.001, [notional]);

  const handleSubmit = async () => {
    if (!quantity || !price) {
      setStatusText("Lütfen miktar ve fiyatı doldurun.");
      return;
    }

    const result = await tradingService.createOrder({
      mode,
      symbol: selectedAsset.symbol,
      side: mode === "spot" ? side : positionType,
      quantity: Number(quantity),
      price: Number(price),
      leverage: mode === "margin" ? leverage : undefined,
    });

    setStatusText(
      result.ok
        ? "İşlem emri oluşturuldu."
        : "İşlem sırasında bir sorun oluştu.",
    );
  };

  const actionLabel =
    mode === "spot"
      ? side === "buy"
        ? "Buy"
        : "Sell"
      : positionType === "long"
        ? "Long"
        : "Short";

  React.useEffect(() => {
    const loadPositions = async () => {
      const portfolioPositions = await portfolioService.getPositions();

      const portfolioMapped: Position[] = portfolioPositions.slice(0, 2).map(
        (item): Position => ({
          symbol: item.symbol,
          side: item.symbol === "TSLA" ? "Short" : "Long",
          size: item.shares,
          entryPrice: item.avgCost,
          markPrice: item.currentPrice,
          pnl: item.marketValue - item.avgCost * item.shares,
          status: "open",
        }),
      );

      const marginPositions: Position[] = [
        {
          symbol: "TSLA",
          side: "Short",
          size: 8,
          entryPrice: 254.2,
          markPrice: 247.1,
          pnl: -56.8,
          status: "open",
        },
        {
          symbol: "NVDA",
          side: "Long",
          size: 5,
          entryPrice: 112.8,
          markPrice: 120.75,
          pnl: 39.75,
          status: "open",
        },
        {
          symbol: "AAPL",
          side: "Long",
          size: 3,
          entryPrice: 188.1,
          markPrice: 193.4,
          pnl: 15.9,
          status: "closed",
        },
      ];

      setPositions([...portfolioMapped, ...marginPositions]);
    };

    loadPositions();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.eyebrow}>Trade</Text>
              <Text style={styles.title}>Spot & leveraged orders</Text>
            </View>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>Live</Text>
            </View>
          </View>

          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "spot" && styles.modeButtonActive,
              ]}
              activeOpacity={0.9}
              onPress={() => setMode("spot")}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === "spot" && styles.modeTextActive,
                ]}
              >
                Spot
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "margin" && styles.modeButtonActive,
              ]}
              activeOpacity={0.9}
              onPress={() => setMode("margin")}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === "margin" && styles.modeTextActive,
                ]}
              >
                Futures
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Asset</Text>
          <View style={styles.assetRow}>
            {assets.map((asset) => (
              <TouchableOpacity
                key={asset.symbol}
                activeOpacity={0.85}
                style={[
                  styles.assetChip,
                  selectedAsset.symbol === asset.symbol &&
                    styles.assetChipActive,
                ]}
                onPress={() => {
                  setSelectedAsset(asset);
                  setPrice(asset.price);
                }}
              >
                <Text style={styles.assetChipSymbol}>{asset.symbol}</Text>
                <Text style={styles.assetChipName}>{asset.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Order direction</Text>
            <Text style={styles.sectionHint}>
              {mode === "spot" ? "Instant execution" : "Leveraged exposure"}
            </Text>
          </View>

          {mode === "spot" ? (
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  side === "buy" && styles.toggleButtonActive,
                ]}
                onPress={() => setSide("buy")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    side === "buy" && styles.toggleTextActive,
                  ]}
                >
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  side === "sell" && styles.toggleButtonActive,
                ]}
                onPress={() => setSide("sell")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    side === "sell" && styles.toggleTextActive,
                  ]}
                >
                  Sell
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  positionType === "long" && styles.toggleButtonActive,
                ]}
                onPress={() => setPositionType("long")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    positionType === "long" && styles.toggleTextActive,
                  ]}
                >
                  Long
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  positionType === "short" && styles.toggleButtonActive,
                ]}
                onPress={() => setPositionType("short")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    positionType === "short" && styles.toggleTextActive,
                  ]}
                >
                  Short
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={theme.colors.mutedText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Entry price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={theme.colors.mutedText}
            />
          </View>

          {mode === "margin" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Leverage</Text>
              <View style={styles.leverageRow}>
                {[1, 2, 3, 5].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.leverageChip,
                      leverage === value && styles.leverageChipActive,
                    ]}
                    onPress={() => setLeverage(value)}
                  >
                    <Text
                      style={[
                        styles.leverageText,
                        leverage === value && styles.leverageTextActive,
                      ]}
                    >
                      {value}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeaderRow}>
            <Text style={styles.summaryTitle}>Order summary</Text>
            <Text style={styles.actionBadge}>{actionLabel}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Asset</Text>
            <Text style={styles.summaryValue}>{selectedAsset.symbol}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Notional</Text>
            <Text style={styles.summaryValue}>${notional.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {mode === "spot" ? "Estimated fee" : "Estimated margin"}
            </Text>
            <Text style={styles.summaryValue}>
              ${mode === "spot" ? fee.toFixed(2) : estimatedMargin.toFixed(2)}
            </Text>
          </View>
        </View>

        {mode === "margin" ? (
          <View style={styles.positionsCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Positions</Text>
              <Text style={styles.sectionHint}>Open vs closed</Text>
            </View>

            <View style={styles.positionGroup}>
              <Text style={styles.positionGroupTitle}>Open</Text>
              {positions
                .filter((position) => position.status === "open")
                .map((position, index) => (
                  <View
                    key={`${position.symbol}-${position.side}-open-${index}`}
                    style={styles.positionCard}
                  >
                    <View style={styles.positionCardTop}>
                      <View style={styles.positionInfo}>
                        <View style={styles.positionAvatar}>
                          <Text style={styles.positionAvatarText}>
                            {position.symbol[0]}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.positionSymbol}>
                            {position.symbol}
                          </Text>
                          <Text style={styles.positionSide}>
                            {position.side} · {position.size} shares
                          </Text>
                        </View>
                      </View>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>Open</Text>
                      </View>
                    </View>

                    <View style={styles.positionMetaRow}>
                      <View>
                        <Text style={styles.metaLabel}>Entry</Text>
                        <Text style={styles.metaValue}>
                          {formatCurrency(position.entryPrice)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.metaLabel}>Mark</Text>
                        <Text style={styles.metaValue}>
                          {formatCurrency(position.markPrice)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.metaLabel}>P/L</Text>
                        <Text
                          style={[
                            styles.metaValue,
                            position.pnl >= 0
                              ? styles.positive
                              : styles.negative,
                          ]}
                        >
                          {position.pnl >= 0 ? "+" : ""}
                          {formatCurrency(position.pnl)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionButtonText}>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryAction]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.secondaryActionText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>

            <View style={[styles.positionGroup, styles.closedGroup]}>
              <Text style={styles.positionGroupTitle}>Closed</Text>
              {positions
                .filter((position) => position.status === "closed")
                .map((position, index) => (
                  <View
                    key={`${position.symbol}-${position.side}-closed-${index}`}
                    style={styles.positionCard}
                  >
                    <View style={styles.positionCardTop}>
                      <View style={styles.positionInfo}>
                        <View
                          style={[styles.positionAvatar, styles.closedAvatar]}
                        >
                          <Text style={styles.positionAvatarText}>
                            {position.symbol[0]}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.positionSymbol}>
                            {position.symbol}
                          </Text>
                          <Text style={styles.positionSide}>
                            {position.side} · Closed
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, styles.closedBadge]}>
                        <Text style={styles.statusBadgeText}>Closed</Text>
                      </View>
                    </View>

                    <View style={styles.positionMetaRow}>
                      <View>
                        <Text style={styles.metaLabel}>Entry</Text>
                        <Text style={styles.metaValue}>
                          {formatCurrency(position.entryPrice)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.metaLabel}>Exit</Text>
                        <Text style={styles.metaValue}>
                          {formatCurrency(position.markPrice)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.metaLabel}>Result</Text>
                        <Text style={[styles.metaValue, styles.neutral]}>
                          +{formatCurrency(position.pnl)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        ) : null}

        {statusText ? (
          <Text style={styles.statusText}>{statusText}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.9}
          onPress={handleSubmit}
        >
          <Ionicons
            name="rocket-outline"
            size={18}
            color={theme.colors.secondary}
          />
          <Text style={styles.submitButtonText}>Place {actionLabel} order</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    marginTop: theme.spacing.xs,
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  liveBadge: {
    backgroundColor: `${theme.colors.success}22`,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
  },
  liveBadgeText: {
    color: theme.colors.success,
    fontWeight: "700",
  },
  modeRow: {
    flexDirection: "row",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  modeButton: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: `${theme.colors.primary}22`,
    borderColor: theme.colors.primary,
  },
  modeText: {
    color: theme.colors.mutedText,
    fontWeight: "600",
  },
  modeTextActive: {
    color: theme.colors.primary,
  },
  sectionCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: "700",
    color: theme.colors.text,
  },
  sectionHint: {
    fontSize: theme.typography.caption,
    color: theme.colors.mutedText,
  },
  assetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  assetChip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minWidth: 96,
  },
  assetChipActive: {
    backgroundColor: `${theme.colors.primary}15`,
    borderColor: theme.colors.primary,
  },
  assetChipSymbol: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  assetChipName: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  toggleButton: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  toggleTextActive: {
    color: theme.colors.secondary,
  },
  inputGroup: {
    marginTop: theme.spacing.md,
  },
  label: {
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.caption,
  },
  input: {
    backgroundColor: `${theme.colors.background}cc`,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  leverageRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  leverageChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  leverageChipActive: {
    backgroundColor: `${theme.colors.primary}22`,
    borderColor: theme.colors.primary,
  },
  leverageText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  leverageTextActive: {
    color: theme.colors.primary,
  },
  summaryCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
  },
  summaryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: theme.typography.subtitle,
  },
  actionBadge: {
    color: theme.colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    color: theme.colors.mutedText,
  },
  summaryValue: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  positionsCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  positionGroup: {
    marginTop: theme.spacing.sm,
  },
  positionGroupTitle: {
    color: theme.colors.primary,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  closedGroup: {
    marginTop: theme.spacing.md,
    opacity: 0.9,
  },
  positionRow: {
    paddingVertical: theme.spacing.xs,
  },
  positionCard: {
    backgroundColor: `${theme.colors.background}cc`,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  positionCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  positionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  positionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  closedAvatar: {
    backgroundColor: `${theme.colors.mutedText}20`,
  },
  positionAvatarText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  positionSymbol: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  positionSide: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginTop: 2,
  },
  positionStats: {
    alignItems: "flex-end",
  },
  positionValue: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  positionPnl: {
    fontSize: theme.typography.caption,
    fontWeight: "700",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: `${theme.colors.primary}20`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
  },
  closedBadge: {
    backgroundColor: `${theme.colors.mutedText}20`,
  },
  statusBadgeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: "700",
  },
  positionMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  metaLabel: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginBottom: 2,
  },
  metaValue: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  cardActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  actionButtonText: {
    color: theme.colors.secondary,
    fontWeight: "700",
  },
  secondaryAction: {
    backgroundColor: `${theme.colors.success}20`,
  },
  secondaryActionText: {
    color: theme.colors.success,
    fontWeight: "700",
  },
  positive: {
    color: theme.colors.success,
  },
  negative: {
    color: theme.colors.danger,
  },
  neutral: {
    color: theme.colors.mutedText,
  },
  statusText: {
    marginTop: theme.spacing.md,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },
  submitButtonText: {
    color: theme.colors.secondary,
    fontWeight: "700",
    fontSize: theme.typography.subtitle,
  },
});
