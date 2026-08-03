import React, { useState } from "react";
import { Section, SettingsPage, ChoiceRow } from "./SettingsDetailScreens";
import { StyleSheet,  Text, View } from "react-native";
import { theme } from "../../theme";
import { Ionicons } from "@expo/vector-icons";

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

export function HelpCenterScreen() {
  return (
    <SettingsPage title="Help Center" subtitle="Answers to common questions">
      <Section>
        <InfoBlock
          title="How does the investment game work?"
          text="Build a virtual portfolio, follow markets and practice trading without using real money."
        />
        <InfoBlock
          title="Are prices real-time?"
          text="Prices may be delayed and are provided for educational and simulation purposes."
        />
        <InfoBlock
          title="How do I add an asset to my watchlist?"
          text="Open an asset detail page and tap the star icon to add or remove it."
        />
        <InfoBlock
          title="Need more help?"
          text="Contact us at yusuftan41@hotmail.com."
        />
      </Section>
    </SettingsPage>
  );
}

export function PrivacyPolicyScreen() {
  return (
    <SettingsPage
      title="Privacy Policy"
      subtitle="How your information is handled"
    >
      <Section>
        <InfoBlock
          title="Information we collect"
          text="We store the account details and application activity needed to provide your profile, watchlist and simulated portfolio."
        />
        <InfoBlock
          title="How we use information"
          text="Information is used to operate, secure and improve the application. We do not sell personal information."
        />
        <InfoBlock
          title="Data control"
          text="You may request access, correction or deletion of your account data by contacting support."
        />
        <InfoBlock
          title="Contact"
          text="Privacy questions can be sent to yusuftan41@hotmail.com."
        />
      </Section>
      <Text style={styles.note}>Last updated: July 2026</Text>
    </SettingsPage>
  );
}

export function TermsOfServiceScreen() {
  return (
    <SettingsPage
      title="Terms of Service"
      subtitle="Rules for using the application"
    >
      <Section>
        <InfoBlock
          title="Educational use"
          text="This application is an investment simulation. Nothing in the app is financial advice or an offer to buy or sell an asset."
        />
        <InfoBlock
          title="Account responsibility"
          text="You are responsible for keeping your login details secure and for activity performed through your account."
        />
        <InfoBlock
          title="Market information"
          text="Market data can be delayed, incomplete or inaccurate and should not be used for real investment decisions."
        />
        <InfoBlock
          title="Fair use"
          text="Do not misuse the service, disrupt its operation or attempt to access other users' information."
        />
      </Section>
      <Text style={styles.note}>Effective date: July 2026</Text>
    </SettingsPage>
  );
}

export function AboutScreen() {
  return (
    <SettingsPage title="About" subtitle="About Investment App">
      <View style={styles.aboutIcon}>
        <Ionicons name="trending-up" size={42} color={theme.colors.primary} />
      </View>
      <Text style={styles.aboutTitle}>Investment App</Text>
      <Text style={styles.aboutVersion}>Version 1.0.0</Text>
      <Text style={styles.aboutText}>
        A simple investment simulation built to help you explore markets,
        practice portfolio decisions and learn at your own pace.
      </Text>
      <Section title="Application">
        <View style={styles.choiceRow}>
          <Text style={styles.rowTitle}>Environment</Text>
          <Text style={styles.value}>Simulation</Text>
        </View>
        <View style={styles.choiceRow}>
          <Text style={styles.rowTitle}>Build</Text>
          <Text style={styles.value}>1</Text>
        </View>
      </Section>
    </SettingsPage>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginRight: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  headerText: { flex: 1 },
  pageTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: theme.typography.subtitle,
  },
  pageSubtitle: { color: theme.colors.mutedText, marginTop: 2 },
  content: { paddingBottom: theme.spacing.xxl },
  section: { marginBottom: theme.spacing.lg },
  sectionTitle: {
    color: theme.colors.mutedText,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    marginLeft: 2,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowText: { flex: 1, paddingRight: theme.spacing.md },
  rowTitle: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: theme.typography.body,
  },
  rowSubtitle: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    marginTop: 3,
  },
  choiceRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  note: {
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
    lineHeight: 19,
  },
  infoBlock: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  infoText: { color: theme.colors.mutedText, lineHeight: 21 },
  aboutIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${theme.colors.primary}18`,
    marginTop: theme.spacing.md,
  },
  aboutTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: "700",
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  aboutVersion: {
    color: theme.colors.primary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  aboutText: {
    color: theme.colors.mutedText,
    textAlign: "center",
    lineHeight: 22,
    marginVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  value: { color: theme.colors.mutedText },
});