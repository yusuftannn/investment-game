import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { theme } from "../../theme";
import { formatCurrency } from "../../utils/formatters";

type Goal = {
  id: number;
  title: string;
  current: number;
  target: number;
  color: string;
  icon: string;
};

const initialGoals: Goal[] = [
  {
    id: 1,
    title: "Acil durum fonu",
    current: 7200,
    target: 12000,
    color: "#34d399",
    icon: "shield-checkmark-outline",
  },
  {
    id: 2,
    title: "Yatırım eğitimi",
    current: 2500,
    target: 4000,
    color: "#60a5fa",
    icon: "book-outline",
  },
  {
    id: 3,
    title: "Tatil hedefi",
    current: 3400,
    target: 6000,
    color: "#f4c542",
    icon: "airplane-outline",
  },
];

export function GoalsScreen() {
  const navigation = useNavigation();
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("12000");
  const [current, setCurrent] = useState("4200");

  const totalSaved = useMemo(
    () => goals.reduce((sum, goal) => sum + goal.current, 0),
    [goals],
  );

  const totalTarget = useMemo(
    () => goals.reduce((sum, goal) => sum + goal.target, 0),
    [goals],
  );

  const overallProgress = totalTarget
    ? Math.min(100, Math.round((totalSaved / totalTarget) * 100))
    : 0;

  const handleBoostGoal = (goalId: number) => {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              current: Math.min(goal.target, goal.current + 250),
            }
          : goal,
      ),
    );
  };

  const handleAddGoal = () => {
    const nextTitle = title.trim() || "Yeni hedef";
    const nextTarget = Number(target) || 1000;
    const nextCurrent = Math.min(Number(current) || 0, nextTarget);

    setGoals((currentGoals) => [
      ...currentGoals,
      {
        id: Date.now(),
        title: nextTitle,
        current: nextCurrent,
        target: nextTarget,
        color: ["#f4c542", "#34d399", "#60a5fa", "#f97316"][
          currentGoals.length % 4
        ],
        icon: "flag-outline",
      },
    ]);

    setTitle("");
    setTarget("12000");
    setCurrent("4200");
  };

  return (
    <ScreenContainer>
      <View style={styles.pageHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Goals</Text>
          <Text style={styles.title}>Investment road map</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>Portfolio goal progress</Text>
              <Text style={styles.summaryValue}>{overallProgress}%</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{formatCurrency(totalSaved)}</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${overallProgress}%` }]}
            />
          </View>

          <Text style={styles.summaryText}>
            {formatCurrency(totalSaved)} saved of {formatCurrency(totalTarget)}{" "}
            in total.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Create new goal</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Goal name"
            placeholderTextColor={theme.colors.mutedText}
          />

          <View style={styles.formRow}>
            <TextInput
              value={target}
              onChangeText={setTarget}
              style={[
                styles.input,
                styles.halfInput,
                { marginRight: theme.spacing.sm },
              ]}
              placeholder="Target"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.mutedText}
            />
            <TextInput
              value={current}
              onChangeText={setCurrent}
              style={[styles.input, styles.halfInput]}
              placeholder="Current"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.mutedText}
            />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddGoal}
            activeOpacity={0.85}
          >
            <Text style={styles.addButtonText}>Add goal</Text>
          </TouchableOpacity>
        </View>

        {goals.map((goal) => {
          const progress = Math.min(100, (goal.current / goal.target) * 100);

          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleWrap}>
                  <View
                    style={[
                      styles.goalBadge,
                      { backgroundColor: `${goal.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={goal.icon as never}
                      size={18}
                      color={goal.color}
                    />
                  </View>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                </View>

                <Text style={styles.goalMeta}>{Math.round(progress)}%</Text>
              </View>

              <View style={styles.goalNumbers}>
                <Text style={styles.goalAmount}>
                  {formatCurrency(goal.current)}
                </Text>
                <Text style={styles.goalTarget}>
                  of {formatCurrency(goal.target)}
                </Text>
              </View>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: goal.color,
                    },
                  ]}
                />
              </View>

              <TouchableOpacity
                style={styles.boostButton}
                onPress={() => handleBoostGoal(goal.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.boostButtonText}>Add $250</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginRight: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 12,
    color: theme.colors.mutedText,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  content: {
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.mutedText,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.text,
  },
  scoreBadge: {
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  scoreText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#1e293b",
    borderRadius: 999,
    overflow: "hidden",
    marginVertical: theme.spacing.sm,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  summaryText: {
    fontSize: 13,
    color: theme.colors.mutedText,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  formRow: {
    flexDirection: "row",
  },
  halfInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  addButtonText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 14,
  },
  goalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  goalTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  goalBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  goalTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  goalMeta: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  goalNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: theme.spacing.sm,
  },
  goalAmount: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginRight: 6,
  },
  goalTarget: {
    color: theme.colors.mutedText,
    fontSize: 13,
  },
  boostButton: {
    marginTop: theme.spacing.md,
    backgroundColor: `${theme.colors.primary}18`,
    borderRadius: theme.radius.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  boostButtonText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
});
