export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: { screen?: keyof MainTabParamList } | undefined;
  MarketDetail: { symbol: string };
  Deposit: undefined;
  Watchlist: undefined;
  Settings: undefined;
  News: undefined;
  Notifications: undefined;
  Appearance: undefined;
  Language: undefined;
  Security: undefined;
  Alerts: undefined;
  HelpCenter: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Market: undefined;
  Trade: undefined;
  Portfolio: undefined;
  Profile: undefined;
};

export type PortfolioPosition = {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  changePercent: number;
  marketValue: number;
  allocation: number;
};

export type Market = {
  symbol: string;
  name: string;
  price: number;
  change: number; // percent
  market: MarketCategory;
};

export type PriceAlert = {
  id: number;
  symbol: string;
  condition: string;
  active: boolean;
};

export type MarketCategory = "us" | "bist" | "funds" | "crypto";
