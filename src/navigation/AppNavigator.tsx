import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../store";
import { LoginScreen } from "../features/auth/LoginScreen";
import { HomeScreen } from "../features/home/HomeScreen";
import { MarketsScreen } from "../features/markets/MarketsScreen";
import { TradeScreen } from "../features/trade/TradeScreen";
import { PortfolioScreen } from "../features/portfolio/PortfolioScreen";
import { ProfileScreen } from "../features/profile/ProfileScreen";
import { RootStackParamList, MainTabParamList } from "../types";
import { MarketDetailScreen } from "../features/markets/MarketDetailScreen";
import { DepositScreen } from "../features/deposit/DepositScreen";
import { WatchlistScreen } from "../features/watchlist/WatchlistScreen";
import { authService } from "../services/auth";
import { theme } from "../theme";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#8E8E93",

        tabBarStyle: {
          height: 65,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: "#111827",
          borderTopWidth: 0,
          elevation: 0,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;

            case "Market":
              iconName = focused ? "bar-chart" : "bar-chart-outline";
              break;

            case "Trade":
              iconName = focused
                ? "swap-horizontal"
                : "swap-horizontal-outline";
              break;

            case "Portfolio":
              iconName = focused ? "wallet" : "wallet-outline";
              break;

            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />

      <Tab.Screen
        name="Market"
        component={MarketsScreen}
        options={{ title: "Markets" }}
      />

      <Tab.Screen
        name="Trade"
        component={TradeScreen}
        options={{
          title: "Trade",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.colors.primary,
                justifyContent: "center",
                alignItems: "center",
                marginTop: -25,
              }}
            >
              <Ionicons name="swap-horizontal" color="#fff" size={30} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{ title: "Portfolio" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const authStatus = useAppStore((state) => state.authStatus);
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const setAuthStatus = useAppStore((state) => state.setAuthStatus);

  useEffect(() => {
    const { data } = authService.onAuthStateChange((_event, session) => {
      const authenticated = !!session;
      setAuthenticated(authenticated);
      setAuthStatus(authenticated ? "authenticated" : "unauthenticated");
    });

    authService.getSession().then(({ data: { session } }) => {
      const authenticated = !!session;
      setAuthenticated(authenticated);
      setAuthStatus(authenticated ? "authenticated" : "unauthenticated");
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [setAuthenticated, setAuthStatus]);

  if (authStatus === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="MarketDetail" component={MarketDetailScreen} />
            <Stack.Screen name="Deposit" component={DepositScreen} />
            <Stack.Screen name="Watchlist" component={WatchlistScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={LoginScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
