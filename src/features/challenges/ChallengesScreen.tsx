import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { theme } from "../../theme";

type Challenge = {
  id: number;
  title: string;
  description: string;
  current: number;
  target: number;
  reward: string;
  badge: string;
  color: string;
  achieved: boolean;
};

const initialChallenges: Challenge[] = [
  {
    id: 1,
    title: "Portfolio Growth",
    description: "Reach a total balance of $30,000.",
    current: 24850,
    target: 30000,
    reward: "+250 XP",
    badge: "Goal",
    color: "#f4c542",
    achieved: false,
  },
  {
    id: 2,
    title: "Diversification",
    description: "Keep at least 40% in tech stocks.",
    current: 36,
    target: 40,
    reward: "+100 XP",
    badge: "Risk",
    color: "#60a5fa",
    achieved: false,
  },
  {
    id: 3,
    title: "Cash Buffer",
    description: "Keep available cash above $8,000.",
    current: 8420,
    target: 8000,
    reward: "+150 XP",
    badge: "Safety",
    color: "#34d399",
    achieved: true,
  },
];

export function ChallengesScreen() {
  const navigation = useNavigation();
  const [challenges, setChallenges] = useState(initialChallenges);

  const completedCount = useMemo(
    () => challenges.filter((challenge) => challenge.achieved).length,
    [challenges],
  );

  const totalProgress = useMemo(() => {
    if (challenges.length === 0) {
      return 0;
    }

    return Math.round((completedCount / challenges.length) * 100);
  }, [challenges.length, completedCount]);

  const handleClaimReward = (id: number) => {
    setChallenges((current) =>
      current.map((challenge) =>
        challenge.id === id
          ? { ...challenge, achieved: true }
          : challenge,
      ),
    );
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
          <Text style={styles.eyebrow}>Challenges</Text>
          <Text style={styles.title}>Weekly mission board</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>Season progress</Text>
              <Text style={styles.summaryValue}>{totalProgress}%</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{completedCount}/3</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${totalProgress}%` },
              ]}
            />
          </View>

          <Text style={styles.summaryText}>
            Complete missions to unlock portfolio bonuses and rank upgrades.
          </Text>
        </View>

        {challenges.map((challenge) => {
          const progress = Math.min(
            100,
            (challenge.current / challenge.target) * 100,
          );

          return (
            <View key={challenge.id} style={styles.challengeCard}>
              <View style={styles.cardHeader}>
                <View style={styles.titleWrap}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: `${challenge.color}20` },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: challenge.color }]}>
                      {challenge.badge}
                    </Text>
                  </View>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                </View>

                <Text style={styles.rewardText}>{challenge.reward}</Text>
              </View>

              <Text style={styles.challengeDescription}>{challenge.description}</Text>

              <View style={styles.progressMeta}>
                <Text style={styles.progressText}>
                  {challenge.current}
                  {challenge.title === "Portfolio Growth" ? " / $" : "%"}
                  {challenge.target}
                </Text>
                <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
              </View>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: challenge.color,
                    },
                  ]}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.claimButton,
                  challenge.achieved && styles.claimButtonCompleted,
                ]}
                onPress={() => handleClaimReward(challenge.id)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.claimButtonText,
                    challenge.achieved && styles.claimButtonTextCompleted,
                  ]}
                >
                  {challenge.achieved ? "Claimed" : "Claim reward"}
                </Text>
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
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: "700",
    marginTop: theme.spacing.xs,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "700",
    marginTop: theme.spacing.xs,
  },
  scoreBadge: {
    backgroundColor: `${theme.colors.primary}18`,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  scoreText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  progressBar: {
    height: 10,
    width: "100%",
    borderRadius: 999,
    backgroundColor: `${theme.colors.border}80`,
    overflow: "hidden",
    marginTop: theme.spacing.lg,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
  },
  summaryText: {
    color: theme.colors.mutedText,
    marginTop: theme.spacing.md,
    lineHeight: 20,
  },
  challengeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleWrap: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginBottom: theme.spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  challengeTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: "700",
  },
  rewardText: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: "700",
  },
  challengeDescription: {
    color: theme.colors.mutedText,
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  progressText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  progressPercent: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  claimButton: {
    marginTop: theme.spacing.md,
    backgroundColor: `${theme.colors.primary}12`,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${theme.colors.primary}50`,
  },
  claimButtonCompleted: {
    backgroundColor: `${theme.colors.success}20`,
    borderColor: `${theme.colors.success}50`,
  },
  claimButtonText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  claimButtonTextCompleted: {
    color: theme.colors.success,
  },
});
