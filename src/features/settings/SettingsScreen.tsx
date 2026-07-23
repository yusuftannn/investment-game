import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { theme } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
const settings = [
  {
    title: "Account",
    items: [
      {
        icon: "person-outline",
        title: "Profile",
        subtitle: "Manage your personal information",
      },
      {
        icon: "star-outline",
        title: "Watchlist",
        subtitle: "View your favorite markets",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        icon: "notifications-outline",
        title: "Notifications",
        subtitle: "Price alerts and news",
      },
      {
        icon: "moon-outline",
        title: "Appearance",
        subtitle: "Dark mode settings",
      },
      {
        icon: "language-outline",
        title: "Language",
        subtitle: "English",
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        icon: "shield-checkmark-outline",
        title: "Security",
        subtitle: "Password & authentication",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        icon: "help-circle-outline",
        title: "Help Center",
        subtitle: "FAQs and documentation",
      },
      {
        icon: "document-text-outline",
        title: "Privacy Policy",
        subtitle: "Read our privacy policy",
      },
      {
        icon: "reader-outline",
        title: "Terms of Service",
        subtitle: "Application terms",
      },
      {
        icon: "information-circle-outline",
        title: "About",
        subtitle: "Version 1.0.0",
      },
    ],
  },
];
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<NavProp>();
  return (
    <ScreenContainer>
      <View style={styles.pageHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>

        <View>
          <Text style={styles.symbol}>Settings</Text>
          <Text style={styles.sub}>Manage your account & preferences</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color={theme.colors.primary} />
          </View>

          <Text style={styles.name}>Demo User</Text>
          <Text style={styles.email}>demo@nexardynamics.com</Text>
        </View>

        {settings.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.card}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.title}
                  activeOpacity={0.8}
                  style={[
                    styles.row,
                    index !== section.items.length - 1 && styles.rowBorder,
                  ]}
                >
                  <View style={styles.left}>
                    <View style={styles.iconBox}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>

                    <View>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.subtitle}>{item.subtitle}</Text>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.mutedText}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity activeOpacity={0.85} style={styles.logoutButton}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.colors.danger}
          />

          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Nexar Dynamics Mobile</Text>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxl,
  },

  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },

  name: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: "700",
  },

  email: {
    marginTop: 4,
    color: theme.colors.mutedText,
  },

  section: {
    marginBottom: theme.spacing.lg,
  },

  sectionTitle: {
    color: theme.colors.mutedText,
    marginBottom: theme.spacing.sm,
    marginLeft: 2,
    fontWeight: "600",
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: `${theme.colors.primary}18`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },

  title: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: theme.typography.body,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },

  subtitle: {
    color: theme.colors.mutedText,
    marginTop: 2,
    fontSize: theme.typography.caption,
  },

  backButton: {
    marginRight: theme.spacing.md,
  },

  symbol: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: theme.typography.subtitle,
  },

  sub: {
    color: theme.colors.mutedText,
  },

  logoutButton: {
    marginTop: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.danger,
    gap: theme.spacing.sm,
  },

  logoutText: {
    color: theme.colors.danger,
    fontWeight: "700",
  },

  footer: {
    marginTop: theme.spacing.xl,
    textAlign: "center",
    color: theme.colors.text,
    fontWeight: "600",
  },

  version: {
    marginTop: 4,
    textAlign: "center",
    color: theme.colors.mutedText,
    fontSize: theme.typography.caption,
  },
});
